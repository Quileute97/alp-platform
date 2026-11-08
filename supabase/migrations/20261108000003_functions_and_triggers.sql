-- ====================================================================
-- ALP – Algo License Platform: Migration 03 - Functions & Triggers
-- ====================================================================

-- 1. Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_licenses_updated_at
    BEFORE UPDATE ON public.licenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Auth User created -> Automatically create Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, ''), '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        'active'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (if auth schema exists in Supabase)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 3. Audit log recording helper
CREATE OR REPLACE FUNCTION public.record_audit_log(
    p_actor_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, metadata)
    VALUES (p_actor_id, p_action, p_resource_type, p_resource_id, p_metadata)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Atomic Order Fulfillment Function (called by verified webhook or payment engine)
CREATE OR REPLACE FUNCTION public.fulfill_order(
    p_order_id UUID,
    p_provider TEXT,
    p_provider_event_id TEXT,
    p_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_plan RECORD;
    v_duration_days INTEGER;
    v_sub_id UUID;
    v_expires_at TIMESTAMPTZ;
    v_created_subs JSONB := '[]'::jsonb;
BEGIN
    -- 1. Verify and lock order
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'ORDER_NOT_FOUND');
    END IF;

    -- Idempotency check: if already paid, return success without re-creating
    IF v_order.status = 'paid' THEN
        RETURN jsonb_build_object('success', true, 'message', 'ORDER_ALREADY_FULFILLED');
    END IF;

    -- 2. Mark order as paid
    UPDATE public.orders
    SET status = 'paid', paid_at = timezone('utc'::text, now())
    WHERE id = p_order_id;

    -- Record payment event
    INSERT INTO public.payment_events (provider, provider_event_id, order_id, event_type, payload, processed_at)
    VALUES (p_provider, p_provider_event_id, p_order_id, 'payment.succeeded', p_payload, timezone('utc'::text, now()))
    ON CONFLICT (provider, provider_event_id) DO NOTHING;

    -- 3. Loop over items and create subscriptions + entitlements
    FOR v_item IN (SELECT * FROM public.order_items WHERE order_id = p_order_id) LOOP
        -- Retrieve plan details
        SELECT p.*, pp.id as product_plan_id 
        INTO v_plan 
        FROM public.product_plans pp
        JOIN public.plans p ON p.id = pp.plan_id
        WHERE pp.id = v_item.product_plan_id;

        IF FOUND THEN
            v_duration_days := v_plan.duration_days;
            v_expires_at := timezone('utc'::text, now()) + (v_duration_days || ' days')::interval;

            -- Check if user already has an active subscription for this product
            -- If active subscription exists, extend it; otherwise create new
            SELECT id, expires_at INTO v_sub_id, v_expires_at
            FROM public.subscriptions
            WHERE user_id = v_order.user_id 
            AND product_plan_id = v_item.product_plan_id
            AND status = 'active'
            ORDER BY expires_at DESC LIMIT 1;

            IF FOUND THEN
                -- Renewal: extend from existing expiration if in the future, or from now if already past
                IF v_expires_at > timezone('utc'::text, now()) THEN
                    v_expires_at := v_expires_at + (v_duration_days || ' days')::interval;
                ELSE
                    v_expires_at := timezone('utc'::text, now()) + (v_duration_days || ' days')::interval;
                END IF;

                UPDATE public.subscriptions
                SET expires_at = v_expires_at, status = 'active'
                WHERE id = v_sub_id;
            ELSE
                INSERT INTO public.subscriptions (
                    user_id, order_id, product_plan_id, status, start_at, expires_at
                ) VALUES (
                    v_order.user_id, p_order_id, v_item.product_plan_id, 'active', 
                    timezone('utc'::text, now()), v_expires_at
                ) RETURNING id INTO v_sub_id;
            END IF;

            -- Create or update Entitlement
            INSERT INTO public.entitlements (
                user_id, product_id, source_type, source_id, status, starts_at, expires_at
            ) VALUES (
                v_order.user_id, v_item.product_id, 'subscription', v_sub_id, 'active',
                timezone('utc'::text, now()), v_expires_at
            );

            v_created_subs := v_created_subs || jsonb_build_object(
                'subscription_id', v_sub_id,
                'product_id', v_item.product_id,
                'expires_at', v_expires_at
            );
        END IF;
    END LOOP;

    -- Record Audit Log
    PERFORM public.record_audit_log(
        v_order.user_id,
        'ORDER_FULFILLED',
        'orders',
        p_order_id::text,
        jsonb_build_object('amount', v_order.amount, 'subscriptions', v_created_subs)
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'subscriptions', v_created_subs
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

