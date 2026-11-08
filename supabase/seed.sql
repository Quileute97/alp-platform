-- ====================================================================
-- ALP – Algo License Platform: Seed Data
-- ====================================================================

-- 1. SEED PLANS
INSERT INTO public.plans (id, name, billing_interval, duration_days, description, active)
VALUES
    ('plan_monthly', 'Gói 1 Tháng', 'monthly', 30, 'Thanh toán chu kỳ 30 ngày', true),
    ('plan_quarterly', 'Gói 3 Tháng (Quý)', 'quarterly', 90, 'Tiết kiệm 15% so với từng tháng', true),
    ('plan_semi_annual', 'Gói 6 Tháng', 'semi_annual', 180, 'Tiết kiệm 25% với hỗ trợ kỹ thuật ưu tiên', true),
    ('plan_yearly', 'Gói 1 Năm', 'yearly', 365, 'Gói tối ưu nhất - Tiết kiệm 40% chi phí', true),
    ('plan_lifetime', 'Gói Trọn Đời', 'lifetime', 36500, 'Sở hữu trọn đời kèm cập nhật phiên bản', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    duration_days = EXCLUDED.duration_days,
    description = EXCLUDED.description;

-- 2. SEED PRODUCTS
INSERT INTO public.products (id, slug, name, description, product_type, platform, version, status, features, supported_symbols, image_url)
VALUES
    (
        'GBPUSD_ALCHEMIST',
        'gbpusd-alchemist-cbot',
        'Alchemist Bot GBPUSD Pro',
        'cBot tự động giao dịch scalping chuyên sâu trên cặp GBPUSD, kết hợp kiểm soát Drawdown thích ứng và tối ưu hóa phiên London Breakout.',
        'cbot',
        'ctrader',
        '2.1.0',
        'active',
        '["Chiến lược London Breakout thích ứng", "Kiểm soát rủi ro tự động Dynamic Trailing Stop", "Chống giãn spread tin tức mạnh mẽ", "Khớp lệnh siêu tốc dưới 50ms"]'::jsonb,
        '["GBPUSD"]'::jsonb,
        '/images/products/alchemist.png'
    ),
    (
        'EURGBP_MEAN_GRID',
        'eurgbp-asymmetric-grid',
        'Asymmetric Mean Grid EURGBP',
        'cBot lưới phi đối xứng tái cân bằng vị thế, khai thác triệt để đặc tính sideway biên độ hẹp của cặp tiền EURGBP.',
        'cbot',
        'ctrader',
        '1.4.2',
        'active',
        '["Lưới phi đối xứng Asymmetric Grid", "Tự động phân bổ lại vị thế khi biến động", "Bảo vệ vốn thông minh Equity Protection", "Tối ưu hóa swap âm"]'::jsonb,
        '["EURGBP", "EURCHF"]'::jsonb,
        '/images/products/grid.png'
    ),
    (
        'ELLIOTT_WAVE_SCANNER',
        'elliott-wave-scanner-indicator',
        'Elliott Wave Scanner & Harmonic Pro',
        'Chỉ báo tự động nhận diện mẫu hình sóng Elliott (1-2-3-4-5, A-B-C) và mô hình Harmonic theo thời gian thực trên cTrader.',
        'indicator',
        'ctrader',
        '3.0.1',
        'active',
        '["Tự động vẽ sóng Elliott các chu kỳ", "Nhận diện mô hình Gartley, Bat, Butterfly", "Cảnh báo tín hiệu qua Telegram / Popup", "Độ chính xác cao trên đa khung thời gian"]'::jsonb,
        '["Mọi cặp Forex", "XAUUSD", "BTCUSD", "US500"]'::jsonb,
        '/images/products/elliott.png'
    ),
    (
        'SMC_ICT_STRUCTURE',
        'smart-money-concepts-smc-ict',
        'Smart Money Concepts (SMC & ICT)',
        'Bộ chỉ báo quét thanh khoản Liquidity Sweep, Order Block (OB), Fair Value Gap (FVG) và Break of Structure (BOS) chuyên nghiệp.',
        'indicator',
        'ctrader',
        '2.0.0',
        'active',
        '["Đánh dấu Order Blocks và FVG thời gian thực", "Xác định BOS, CHoCH cấu trúc thị trường", "Vùng cung cầu Premium / Discount Zone", "Tối ưu cho phiên Á, London và New York"]'::jsonb,
        '["Forex", "XAUUSD", "Chỉ số"]'::jsonb,
        '/images/products/smc.png'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    version = EXCLUDED.version,
    features = EXCLUDED.features;

-- 3. SEED PRODUCT PLANS
-- Alchemist Bot Pricing
INSERT INTO public.product_plans (product_id, plan_id, price, currency, max_accounts, active)
VALUES
    ('GBPUSD_ALCHEMIST', 'plan_monthly', 49.00, 'USD', 1, true),
    ('GBPUSD_ALCHEMIST', 'plan_quarterly', 129.00, 'USD', 2, true),
    ('GBPUSD_ALCHEMIST', 'plan_yearly', 399.00, 'USD', 3, true),
    ('GBPUSD_ALCHEMIST', 'plan_lifetime', 899.00, 'USD', 5, true),

    ('EURGBP_MEAN_GRID', 'plan_monthly', 39.00, 'USD', 1, true),
    ('EURGBP_MEAN_GRID', 'plan_quarterly', 99.00, 'USD', 2, true),
    ('EURGBP_MEAN_GRID', 'plan_yearly', 299.00, 'USD', 3, true),

    ('ELLIOTT_WAVE_SCANNER', 'plan_monthly', 29.00, 'USD', 1, true),
    ('ELLIOTT_WAVE_SCANNER', 'plan_yearly', 199.00, 'USD', 2, true),
    ('ELLIOTT_WAVE_SCANNER', 'plan_lifetime', 499.00, 'USD', 5, true),

    ('SMC_ICT_STRUCTURE', 'plan_monthly', 29.00, 'USD', 1, true),
    ('SMC_ICT_STRUCTURE', 'plan_yearly', 199.00, 'USD', 2, true),
    ('SMC_ICT_STRUCTURE', 'plan_lifetime', 499.00, 'USD', 5, true)
ON CONFLICT (product_id, plan_id) DO NOTHING;

-- 4. SEED PRODUCT VERSIONS
INSERT INTO public.product_versions (product_id, version, release_notes, download_file_path, minimum_supported_version, status)
VALUES
    (
        'GBPUSD_ALCHEMIST',
        '2.1.0',
        '- Tích hợp ALP License Manager v1.0\n- Nâng cấp bộ lọc biến động tin tức CPI/FOMC\n- Tối ưu hóa khớp lệnh trượt giá',
        '/downloads/cbots/Alchemist_GBPUSD_v2.1.0.algo',
        '5.0.0',
        'active'
    ),
    (
        'EURGBP_MEAN_GRID',
        '1.4.2',
        '- Sửa lỗi tính khoảng cách lưới theo ATR\n- Tích hợp heartbeat license ALP',
        '/downloads/cbots/EURGBP_Grid_v1.4.2.algo',
        '5.0.0',
        'active'
    ),
    (
        'ELLIOTT_WAVE_SCANNER',
        '3.0.1',
        '- Nâng cấp thuật toán phát hiện sóng cụt và mẫu hình phức hợp\n- Tương thích cTrader Automate 5.x',
        '/downloads/indicators/ElliottWaveScanner_v3.0.1.algo',
        '5.0.0',
        'active'
    )
ON CONFLICT (product_id, version) DO NOTHING;

