import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import {
  Product,
  ProductPlan,
  LicenseValidationRequest,
  LicenseValidationResponse,
  HeartbeatRequest,
  HeartbeatResponse,
  Order,
  Subscription,
  TradingAccount,
  Profile
} from '@alp/shared-types';
import { canonicalizePayload, signPayload, hashLicenseKey } from './crypto';
import {
  renderHomePage,
  renderProductDetailPage,
  renderLicenseValidatePage,
  renderHeartbeatPage,
  renderNotFoundPage
} from './views';

type Bindings = {
  ENVIRONMENT: string;
  API_VERSION: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  ED25519_PRIVATE_KEY?: string;
  WEBHOOK_SIGNING_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Mock database store for Phase 1 development & testing
const mockProducts: Product[] = [
  {
    id: 'GBPUSD_ALCHEMIST',
    slug: 'gbpusd-alchemist-cbot',
    name: 'Alchemist Bot GBPUSD Pro',
    description: 'cBot tự động giao dịch scalping chuyên sâu trên cặp GBPUSD, kết hợp kiểm soát Drawdown thích ứng và tối ưu hóa phiên London Breakout.',
    product_type: 'cbot',
    platform: 'ctrader',
    version: '2.1.0',
    status: 'active',
    features: [
      'Chiến lược London Breakout thích ứng',
      'Kiểm soát rủi ro tự động Dynamic Trailing Stop',
      'Chống giãn spread tin tức mạnh mẽ',
      'Khớp lệnh siêu tốc dưới 50ms'
    ],
    supported_symbols: ['GBPUSD'],
    image_url: '/images/products/alchemist.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'EURGBP_MEAN_GRID',
    slug: 'eurgbp-asymmetric-grid',
    name: 'Asymmetric Mean Grid EURGBP',
    description: 'cBot lưới phi đối xứng tái cân bằng vị thế, khai thác triệt để đặc tính sideway biên độ hẹp của cặp tiền EURGBP.',
    product_type: 'cbot',
    platform: 'ctrader',
    version: '1.4.2',
    status: 'active',
    features: [
      'Lưới phi đối xứng Asymmetric Grid',
      'Tự động phân bổ lại vị thế khi biến động',
      'Bảo vệ vốn thông minh Equity Protection',
      'Tối ưu hóa swap âm'
    ],
    supported_symbols: ['EURGBP', 'EURCHF'],
    image_url: '/images/products/grid.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ELLIOTT_WAVE_SCANNER',
    slug: 'elliott-wave-scanner-indicator',
    name: 'Elliott Wave Scanner & Harmonic Pro',
    description: 'Chỉ báo tự động nhận diện mẫu hình sóng Elliott (1-2-3-4-5, A-B-C) và mô hình Harmonic theo thời gian thực trên cTrader.',
    product_type: 'indicator',
    platform: 'ctrader',
    version: '3.0.1',
    status: 'active',
    features: [
      'Tự động vẽ sóng Elliott các chu kỳ',
      'Nhận diện mô hình Gartley, Bat, Butterfly',
      'Cảnh báo tín hiệu qua Telegram / Popup',
      'Độ chính xác cao trên đa khung thời gian'
    ],
    supported_symbols: ['Mọi cặp Forex', 'XAUUSD', 'BTCUSD', 'US500'],
    image_url: '/images/products/elliott.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'SMC_ICT_STRUCTURE',
    slug: 'smart-money-concepts-smc-ict',
    name: 'Smart Money Concepts (SMC & ICT)',
    description: 'Bộ chỉ báo quét thanh khoản Liquidity Sweep, Order Block (OB), Fair Value Gap (FVG) và Break of Structure (BOS) chuyên nghiệp.',
    product_type: 'indicator',
    platform: 'ctrader',
    version: '2.0.0',
    status: 'active',
    features: [
      'Đánh dấu Order Blocks và FVG thời gian thực',
      'Xác định BOS, CHoCH cấu trúc thị trường',
      'Vùng cung cầu Premium / Discount Zone',
      'Tối ưu cho phiên Á, London và New York'
    ],
    supported_symbols: ['Forex', 'XAUUSD', 'Chỉ số'],
    image_url: '/images/products/smc.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockPlans: Record<string, ProductPlan[]> = {
  GBPUSD_ALCHEMIST: [
    { id: 'pp-1', product_id: 'GBPUSD_ALCHEMIST', plan_id: 'plan_monthly', price: 49, currency: 'USD', max_accounts: 1, active: true },
    { id: 'pp-2', product_id: 'GBPUSD_ALCHEMIST', plan_id: 'plan_quarterly', price: 129, currency: 'USD', max_accounts: 2, active: true },
    { id: 'pp-3', product_id: 'GBPUSD_ALCHEMIST', plan_id: 'plan_yearly', price: 399, currency: 'USD', max_accounts: 3, active: true },
    { id: 'pp-4', product_id: 'GBPUSD_ALCHEMIST', plan_id: 'plan_lifetime', price: 899, currency: 'USD', max_accounts: 5, active: true },
  ],
  EURGBP_MEAN_GRID: [
    { id: 'pp-5', product_id: 'EURGBP_MEAN_GRID', plan_id: 'plan_monthly', price: 39, currency: 'USD', max_accounts: 1, active: true },
    { id: 'pp-6', product_id: 'EURGBP_MEAN_GRID', plan_id: 'plan_quarterly', price: 99, currency: 'USD', max_accounts: 2, active: true },
    { id: 'pp-7', product_id: 'EURGBP_MEAN_GRID', plan_id: 'plan_yearly', price: 299, currency: 'USD', max_accounts: 3, active: true },
  ]
};

// ==========================================
// 1. SEO & Robots / Sitemap Endpoints
// ==========================================
app.get('/robots.txt', (c) => {
  const url = new URL(c.req.url);
  const baseUrl = url.origin;
  const robots = `User-agent: *
Allow: /
Allow: /products
Allow: /products/*
Allow: /license/validate
Allow: /license/heartbeat
Disallow: /api/v1/customer/
Disallow: /api/v1/admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
  return c.text(robots, 200, {
    'Content-Type': 'text/plain; charset=UTF-8',
    'Cache-Control': 'public, max-age=86400',
  });
});

const handleSitemap = (c: any) => {
  const url = new URL(c.req.url);
  const baseUrl = url.origin;
  const now = new Date().toISOString().split('T')[0];

  const productUrls = mockProducts
    .filter(p => p.status === 'active')
    .map(p => `  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${productUrls}
  <url>
    <loc>${baseUrl}/license/validate</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/license/heartbeat</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  return c.text(sitemap, 200, {
    'Content-Type': 'application/xml; charset=UTF-8',
    'Cache-Control': 'public, max-age=3600',
  });
};

app.get('/sitemap.xml', handleSitemap);
app.get('/api/v1/sitemap.xml', handleSitemap);
app.get('/api/v1/sitemap', handleSitemap);

// ==========================================
// 2. Frontend Web Pages (Rendered for Web Browsers)
// ==========================================
app.get('/', (c) => {
  const url = new URL(c.req.url);
  return c.html(renderHomePage(mockProducts, url.origin));
});

app.get('/products', (c) => {
  const url = new URL(c.req.url);
  if (c.req.header('Accept')?.includes('application/json') || c.req.query('format') === 'json') {
    const activeProducts = mockProducts.filter(p => p.status === 'active');
    return c.json({ success: true, data: activeProducts });
  }
  return c.html(renderHomePage(mockProducts, url.origin));
});

app.get('/products/:slug', (c) => {
  const slug = c.req.param('slug');
  const product = mockProducts.find(p => p.slug === slug || p.id === slug);
  const url = new URL(c.req.url);
  if (!product) {
    return c.html(renderNotFoundPage(url.origin), 404);
  }

  const plans = mockPlans[product.id] || [];
  if (c.req.header('Accept')?.includes('application/json') || c.req.query('format') === 'json') {
    return c.json({ success: true, data: { ...product, plans } });
  }

  return c.html(renderProductDetailPage(product, plans, url.origin));
});

app.get('/license/validate', (c) => {
  const url = new URL(c.req.url);
  return c.html(renderLicenseValidatePage(mockProducts, url.origin));
});

app.get('/license/heartbeat', (c) => {
  const url = new URL(c.req.url);
  return c.html(renderHeartbeatPage(url.origin));
});

app.get('/api', (c) => {
  return c.redirect('/');
});

app.get('/api/v1/health', (c) => {
  return c.json({
    status: 'healthy',
    platform: 'ALP - Algo License Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. Public Product APIs
// ==========================================
app.get('/api/v1/products', (c) => {
  const activeProducts = mockProducts.filter(p => p.status === 'active');
  return c.json({ success: true, data: activeProducts });
});

app.get('/api/v1/products/:slug', (c) => {
  const slug = c.req.param('slug');
  const product = mockProducts.find(p => p.slug === slug || p.id === slug);
  if (!product) {
    return c.json({ success: false, error: 'PRODUCT_NOT_FOUND', message: 'Sản phẩm không tồn tại.' }, 404);
  }
  const plans = mockPlans[product.id] || [];
  return c.json({ success: true, data: { ...product, plans } });
});

app.get('/api/v1/products/:id/plans', (c) => {
  const id = c.req.param('id');
  const plans = mockPlans[id] || [];
  return c.json({ success: true, data: plans });
});

// ==========================================
// 3. License Validation API (cTrader Algo Integration)
// ==========================================
app.post('/api/v1/license/validate', async (c) => {
  try {
    const body = await c.req.json<LicenseValidationRequest>();
    const { product_id, license_key, account_number, broker, environment, instance_id, app_version } = body;

    if (!product_id || !license_key || !account_number) {
      const errRes: LicenseValidationResponse = {
        valid: false,
        code: 'INVALID_LICENSE',
        message: 'Thiếu thông tin xác thực bản quyền (product_id, license_key hoặc account_number).'
      };
      return c.json(errRes, 400);
    }

    // Check test / demo license keys
    // In production, this queries Supabase licenses + trading_accounts
    const isMockValid = license_key.startsWith('ALG-') && license_key.length >= 10;
    if (!isMockValid) {
      const errRes: LicenseValidationResponse = {
        valid: false,
        code: 'INVALID_LICENSE',
        message: 'Mã license không hợp lệ hoặc không tồn tại trên hệ thống.'
      };
      return c.json(errRes, 403);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const cacheUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours cache

    const payloadToSign = {
      valid: true,
      status: 'active',
      product_id,
      account_number,
      broker: broker || 'Unknown Broker',
      environment: environment || 'live',
      expires_at: expiresAt.toISOString(),
      server_time: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
    };

    const canonical = canonicalizePayload(payloadToSign);
    const signature = await signPayload(canonical, c.env.ED25519_PRIVATE_KEY || 'ALP_LOCAL_SECRET_KEY');

    const successRes: LicenseValidationResponse = {
      valid: true,
      status: 'active',
      product_id,
      expires_at: expiresAt.toISOString(),
      server_time: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
      signature,
    };

    return c.json(successRes);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ valid: false, code: 'API_UNAVAILABLE', message: `Lỗi máy chủ ALP: ${message}` }, 500);
  }
});

// Heartbeat API
app.post('/api/v1/license/heartbeat', async (c) => {
  try {
    const body = await c.req.json<HeartbeatRequest>();
    const now = new Date();
    const cacheUntil = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours

    const payloadToSign = {
      valid: true,
      status: 'active',
      product_id: body.product_id,
      account_number: body.account_number,
      server_time: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
    };

    const signature = await signPayload(canonicalizePayload(payloadToSign), c.env.ED25519_PRIVATE_KEY || 'ALP_LOCAL_SECRET_KEY');

    const res: HeartbeatResponse = {
      valid: true,
      status: 'active',
      server_time: now.toISOString(),
      cache_until: cacheUntil.toISOString(),
      signature,
    };
    return c.json(res);
  } catch {
    return c.json({ valid: false, status: 'suspended', server_time: new Date().toISOString(), cache_until: new Date().toISOString() });
  }
});

// ==========================================
// 4. Customer Endpoints Skeleton
// ==========================================
app.get('/api/v1/customer/orders', (c) => {
  return c.json({
    success: true,
    data: [
      {
        id: 'ord-1001',
        order_number: 'ALP-20261108-01',
        amount: 49.00,
        currency: 'USD',
        status: 'paid',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        paid_at: new Date(Date.now() - 86000000).toISOString()
      }
    ]
  });
});

app.get('/api/v1/customer/subscriptions', (c) => {
  return c.json({
    success: true,
    data: [
      {
        id: 'sub-2001',
        product_plan_id: 'pp-1',
        status: 'active',
        start_at: new Date(Date.now() - 86000000).toISOString(),
        expires_at: new Date(Date.now() + 29 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 86000000).toISOString(),
        product: mockProducts[0]
      }
    ]
  });
});

app.get('/api/v1/customer/licenses', (c) => {
  return c.json({
    success: true,
    data: [
      {
        id: 'lic-3001',
        product_id: 'GBPUSD_ALCHEMIST',
        license_key_prefix: 'ALG-8899',
        status: 'active',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 29 * 86400000).toISOString(),
        product: mockProducts[0]
      }
    ]
  });
});

// ==========================================
// 5. Admin Endpoints Skeleton
// ==========================================
app.get('/api/v1/admin/dashboard', (c) => {
  return c.json({
    success: true,
    data: {
      total_customers: 128,
      active_subscriptions: 94,
      active_licenses: 112,
      monthly_revenue_usd: 5480.00,
      annual_revenue_usd: 48920.00,
      expiring_soon_count: 7,
      recent_orders: [
        { id: 'ord-1001', order_number: 'ALP-20261108-01', amount: 49.00, status: 'paid', customer_email: 'trader1@example.com' }
      ]
    }
  });
});

// ==========================================
// 6. Custom 404 Not Found Handler
// ==========================================
app.notFound((c) => {
  const url = new URL(c.req.url);
  const baseUrl = url.origin;
  if (url.pathname.startsWith('/api/')) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'API route not found' }, 404);
  }
  return c.html(renderNotFoundPage(baseUrl), 404);
});

export default app;

