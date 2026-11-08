-- ====================================================================
-- ALP – Algo License Platform: Migration 02 - Row Level Security (RLS)
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('support', 'admin', 'super_admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- --------------------------------------------------------------------
-- Everyone can read their own profile; Admins can read all profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_staff());

-- Users can update basic details (name) of their own profile, but CANNOT alter role or status
CREATE POLICY "Users can update own name" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND status = (SELECT status FROM public.profiles WHERE id = auth.uid())
);

-- Admin can insert/update any profile (including changing roles and status)
CREATE POLICY "Admins have full access to profiles" 
ON public.profiles FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 2. PRODUCTS & VERSIONS POLICIES
-- --------------------------------------------------------------------
-- Public catalog: Anyone can view active products
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (status = 'active' OR public.is_staff());

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
USING (public.is_admin());

CREATE POLICY "Public can view active versions" 
ON public.product_versions FOR SELECT 
USING (status = 'active' OR public.is_staff());

CREATE POLICY "Admins can manage versions" 
ON public.product_versions FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 3. PLANS & PRICING POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view active plans" 
ON public.plans FOR SELECT 
USING (active = true OR public.is_staff());

CREATE POLICY "Admins can manage plans" 
ON public.plans FOR ALL 
USING (public.is_admin());

CREATE POLICY "Public can view active product plans" 
ON public.product_plans FOR SELECT 
USING (active = true OR public.is_staff());

CREATE POLICY "Admins can manage product plans" 
ON public.product_plans FOR ALL 
USING (public.is_admin());

-- Bundles & Memberships
CREATE POLICY "Public can view active bundles" 
ON public.bundles FOR SELECT 
USING (active = true OR public.is_staff());

CREATE POLICY "Admins can manage bundles" 
ON public.bundles FOR ALL 
USING (public.is_admin());

CREATE POLICY "Public can view bundle products" 
ON public.bundle_products FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage bundle products" 
ON public.bundle_products FOR ALL 
USING (public.is_admin());

CREATE POLICY "Public can view active memberships" 
ON public.memberships FOR SELECT 
USING (active = true OR public.is_staff());

CREATE POLICY "Admins can manage memberships" 
ON public.memberships FOR ALL 
USING (public.is_admin());

CREATE POLICY "Public can view membership products" 
ON public.membership_products FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage membership products" 
ON public.membership_products FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 4. ORDERS & ORDER ITEMS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Users can create own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" 
ON public.orders FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view own order items" 
ON public.order_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR public.is_staff())
    )
);

CREATE POLICY "Users can insert own order items" 
ON public.order_items FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all order items" 
ON public.order_items FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 5. PAYMENT EVENTS (Backend/Webhook Only)
-- --------------------------------------------------------------------
-- Customers have NO access to raw payment events
CREATE POLICY "Admins and service can view payment events" 
ON public.payment_events FOR SELECT 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 6. SUBSCRIPTIONS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Admins can manage subscriptions" 
ON public.subscriptions FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 7. TRADING ACCOUNTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own trading accounts" 
ON public.trading_accounts FOR SELECT 
USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Users can register own trading accounts" 
ON public.trading_accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading accounts" 
ON public.trading_accounts FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all trading accounts" 
ON public.trading_accounts FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 8. LICENSES POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own licenses" 
ON public.licenses FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.subscriptions 
        WHERE subscriptions.id = licenses.subscription_id 
        AND (subscriptions.user_id = auth.uid() OR public.is_staff())
    )
);

CREATE POLICY "Admins can manage all licenses" 
ON public.licenses FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 9. ENTITLEMENTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view own entitlements" 
ON public.entitlements FOR SELECT 
USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "Admins can manage entitlements" 
ON public.entitlements FOR ALL 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- 10. MONITORING & AUDIT LOGS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users can view instances of own licenses" 
ON public.bot_instances FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.licenses 
        JOIN public.subscriptions ON subscriptions.id = licenses.subscription_id
        WHERE licenses.id = bot_instances.license_id 
        AND (subscriptions.user_id = auth.uid() OR public.is_staff())
    )
);

CREATE POLICY "Admins can manage bot instances" 
ON public.bot_instances FOR ALL 
USING (public.is_admin());

CREATE POLICY "Staff can view license events" 
ON public.license_events FOR SELECT 
USING (public.is_staff());

CREATE POLICY "Staff can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_staff());

CREATE POLICY "Admins can manage audit logs" 
ON public.audit_logs FOR ALL 
USING (public.is_admin());

