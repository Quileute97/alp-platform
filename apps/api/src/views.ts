import { Product, ProductPlan } from '@alp/shared-types';

export function getBaseLayout(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd?: Record<string, unknown>;
  content: string;
}): string {
  const { title, description, canonicalUrl, jsonLd, content } = options;

  return `<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ALP cTrader Platform</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="cTrader cBot, Algo trading, Indicator cTrader, Alchemist bot, Asymmetric grid, Elliott Wave, Smart Money Concepts, cTrader Automate">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title} | ALP cTrader Platform">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title} | ALP cTrader Platform">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}

  <!-- Fonts & Tailwind Play CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#3b82f6', 600: '#2563eb' }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #0B0F17; color: #F3F4F6; }
    .glow-blue { box-shadow: 0 0 25px -5px rgba(59, 130, 246, 0.25); }
    .skeleton { background: linear-gradient(90deg, #111827 25%, #1F2937 50%, #111827 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; }
    @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  </style>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">

  <!-- Header -->
  <header class="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ALP
            </span>
            <span class="text-[10px] ml-1.5 uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              cTrader Algo
            </span>
          </div>
        </a>

        <nav class="hidden md:flex items-center space-x-1">
          <a href="/products" class="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
            Kho Sản Phẩm Algo
          </a>
          <a href="/license/validate" class="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
            Kiểm Tra License Key
          </a>
          <a href="/license/heartbeat" class="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
            Giám Sát Heartbeat
          </a>
          <a href="/api/v1/health" target="_blank" class="px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online</span>
          </a>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <a href="/license/validate" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30">
          Kích Hoạt Bản Quyền
        </a>
      </div>
    </div>
  </header>

  <!-- Main Body -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    ${content}
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        © 2026 ALP (Algo License Platform). Phân phối cBot & Indicator cTrader Automate Desktop.
      </div>
      <div class="flex items-center gap-4">
        <a href="/sitemap.xml" class="hover:text-blue-400 transition font-mono">sitemap.xml</a>
        <a href="/robots.txt" class="hover:text-blue-400 transition font-mono">robots.txt</a>
        <a href="/api/v1/health" class="hover:text-emerald-400 transition">Health Status</a>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

// -------------------------------------------------------------
// Trang chủ & Danh mục sản phẩm (Home & Products Page)
// -------------------------------------------------------------
export function renderHomePage(products: Product[], baseUrl: string): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'ALP - Algo License Platform',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Windows (cTrader Desktop)',
    'description': 'Nền tảng thương mại hóa và cấp phép cBot & Indicator chuyên sâu cho cTrader Automate Desktop.',
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'USD',
      'lowPrice': '29.00',
      'highPrice': '899.00'
    }
  };

  const productCardsHtml = products.map((prod) => {
    const isAlchemist = prod.id === 'GBPUSD_ALCHEMIST';
    const minPrice = isAlchemist ? 49 : 39;

    return `
    <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition group">
      <div>
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg group-hover:scale-105 transition-transform">
              🤖
            </div>
            <div>
              <h3 class="font-bold text-lg text-white group-hover:text-blue-400 transition">${prod.name}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">v${prod.version}</span>
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase">${prod.product_type}</span>
                <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">cTrader 5.x</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          ${prod.description}
        </p>

        <!-- Symbols -->
        <div class="mb-4">
          <div class="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Cặp tiền tối ưu:</div>
          <div class="flex flex-wrap gap-1.5">
            ${(prod.supported_symbols || []).map(s => `<span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-mono">${s}</span>`).join('')}
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-1.5 mb-6">
          ${(prod.features || []).slice(0, 3).map(f => `
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="text-emerald-400 font-bold">✓</span>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block">Giá thuê bao từ</span>
          <span class="text-xl font-extrabold text-white font-mono">$${minPrice} <span class="text-xs text-slate-400 font-sans">/tháng</span></span>
        </div>
        <div class="flex items-center gap-2">
          <a href="/products/${prod.slug}" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20">
            Xem Chi Tiết & Giá
          </a>
        </div>
      </div>
    </div>
    `;
  }).join('');

  const content = `
    <!-- Hero Banner -->
    <section class="text-center max-w-4xl mx-auto mb-16 relative">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
        <span>⚡ Hệ Thống Bản Quyền & Phân Phối cTrader Algo Độc Lập</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Kho Thuật Toán Giao Dịch Tự Động <br class="hidden sm:inline" />
        <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">cTrader Automate Desktop</span>
      </h1>

      <p class="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Xác thực bản quyền tốc độ cao với mã hóa bất đối xứng Ed25519. Bảo vệ an toàn tuyệt đối cho tài khoản: không tự động đóng lệnh khi hết hạn thuê bao.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="#products-list" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30">
          Xem ${products.length} Sản Phẩm cBot
        </a>
        <a href="/license/validate" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700">
          Kiểm Tra Mã License Trực Tuyến
        </a>
      </div>
    </section>

    <!-- Products Grid -->
    <section id="products-list" class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">Danh Sách Thuật Toán cTrader Hoạt Động</h2>
          <p class="text-xs text-slate-400 mt-1">Dữ liệu thời gian thực được đồng bộ trực tiếp từ máy chủ ALP Edge.</p>
        </div>
        <div class="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
          Trạng thái API: <span class="text-emerald-400 font-bold">200 OK</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${productCardsHtml}
      </div>
    </section>

    <!-- Features & cTrader Guide -->
    <section class="mt-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-10">
      <div class="max-w-3xl mx-auto text-center space-y-4">
        <h2 class="text-2xl font-bold text-white">Nguyên Tắc An Toàn Giao Dịch ALP</h2>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ALP được thiết kế tuân thủ tiêu chuẩn an toàn vốn tài chính:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
          <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div class="text-emerald-400 font-bold text-sm mb-1">🛡️ Bảo Vệ Lệnh Mở</div>
            <p class="text-xs text-slate-400 leading-relaxed">Khi hết hạn, cBot chỉ dừng mở lệnh mới. Tuyệt đối không đóng cưỡng bức các lệnh đang chạy.</p>
          </div>
          <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div class="text-blue-400 font-bold text-sm mb-1">🔑 Chữ Ký Ed25519</div>
            <p class="text-xs text-slate-400 leading-relaxed">Phản hồi xác thực được ký số bất đối xứng, cBot giải mã và xác minh tính toàn vẹn cục bộ.</p>
          </div>
          <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div class="text-amber-400 font-bold text-sm mb-1">⏱️ Grace Period</div>
            <p class="text-xs text-slate-400 leading-relaxed">Bộ nhớ đệm có chữ ký cho phép bot hoạt động ổn định khi mạng Internet chập chờn.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  return getBaseLayout({
    title: 'Kho Sản Phẩm cBot & Indicator cTrader',
    description: 'Nền tảng cấp phép và phân phối các thuật toán giao dịch cBot chuyên nghiệp trên cTrader Automate Desktop: Alchemist GBPUSD, Asymmetric Grid EURGBP, Elliott Wave Scanner, SMC ICT.',
    canonicalUrl: `${baseUrl}/products`,
    jsonLd,
    content
  });
}

// -------------------------------------------------------------
// Trang chi tiết sản phẩm (Product Detail Page)
// -------------------------------------------------------------
export function renderProductDetailPage(product: Product, plans: ProductPlan[], baseUrl: string): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'sku': product.id,
    'offers': plans.map(p => ({
      '@type': 'Offer',
      'price': p.price.toString(),
      'priceCurrency': p.currency,
      'availability': 'https://schema.org/InStock'
    }))
  };

  const defaultPlans = [
    { name: 'Gói 1 Tháng', interval: 'Tháng', price: product.id === 'GBPUSD_ALCHEMIST' ? 49 : 39, accounts: 1, desc: 'Phù hợp thử nghiệm và kiểm chứng chiến lược' },
    { name: 'Gói 3 Tháng (Quý)', interval: 'Quý', price: product.id === 'GBPUSD_ALCHEMIST' ? 129 : 99, accounts: 2, desc: 'Tiết kiệm 15%, chạy 2 tài khoản cùng lúc' },
    { name: 'Gói 1 Năm', interval: 'Năm', price: product.id === 'GBPUSD_ALCHEMIST' ? 399 : 299, accounts: 3, desc: 'Tối ưu nhất cho nhà đầu tư chuyên nghiệp (Tiết kiệm 40%)' },
    { name: 'Gói Trọn Đời', interval: 'Vĩnh viễn', price: product.id === 'GBPUSD_ALCHEMIST' ? 899 : 499, accounts: 5, desc: 'Sở hữu trọn đời kèm mọi cập nhật thuật toán tương lai' },
  ];

  const content = `
    <div class="space-y-8 max-w-5xl mx-auto">
      <a href="/products" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
        ← Quay lại danh mục sản phẩm
      </a>

      <!-- Overview Box -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20 text-3xl">
          🤖
        </div>

        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 uppercase">
              ${product.product_type}
            </span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              v${product.version}
            </span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              cTrader Automate Desktop
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            ${product.name}
          </h1>

          <p class="text-slate-300 text-sm leading-relaxed mb-6">
            ${product.description}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-4 text-xs">
            <div>
              <span class="text-slate-400 block">Nền tảng</span>
              <span class="text-white font-semibold">cTrader 5.x</span>
            </div>
            <div>
              <span class="text-slate-400 block">Cặp tiền hỗ trợ</span>
              <span class="text-white font-semibold">${product.supported_symbols?.join(', ')}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Mã sản phẩm</span>
              <span class="text-blue-400 font-mono font-semibold">${product.id}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Tương thích</span>
              <span class="text-emerald-400 font-semibold">FullAccess Required</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing Plans -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white">Bảng Giá Thuê Bao & Cấp Phép License</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${defaultPlans.map(plan => `
            <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition">
              <div>
                <h3 class="font-bold text-white text-base mb-1">${plan.name}</h3>
                <p class="text-xs text-slate-400 leading-relaxed mb-4">${plan.desc}</p>
              </div>
              <div>
                <div class="text-2xl font-extrabold text-white font-mono mb-2">$${plan.price} <span class="text-xs text-slate-400 font-sans">/${plan.interval}</span></div>
                <div class="text-xs text-emerald-400 font-semibold mb-4">Tối đa ${plan.accounts} tài khoản cTrader</div>
                <a href="/license/validate" class="block w-full py-2.5 rounded-xl text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition">
                  Kích Hoạt Gói Này
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-2">
        <div class="font-bold text-white text-sm">Hướng dẫn tích hợp cBot vào cTrader Desktop:</div>
        <p>1. Tải tệp <strong>.algo</strong> về máy và nhấp đúp để cài vào cTrader.</p>
        <p>2. Mở tab <strong>Automate</strong> &gt; kéo bot vào chart &gt; cấp quyền <strong>AccessRights = FullAccess</strong>.</p>
        <p>3. Dán mã License Key đã cấp vào thông số robot. Robot sẽ tự động kết nối API ALP để cấp phép.</p>
      </div>
    </div>
  `;

  return getBaseLayout({
    title: product.name,
    description: product.description,
    canonicalUrl: `${baseUrl}/products/${product.slug}`,
    jsonLd,
    content
  });
}

// -------------------------------------------------------------
// Trang kiểm tra License Key trực tuyến (/license/validate)
// -------------------------------------------------------------
export function renderLicenseValidatePage(products: Product[], baseUrl: string): string {
  const content = `
    <div class="max-w-2xl mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Kiểm Tra Bản Quyền (License Validator)</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Xác thực mã bản quyền cBot theo thời gian thực với chữ ký số bất đối xứng Ed25519 từ máy chủ ALP.
        </p>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <form id="license-form" class="space-y-4 text-xs">
          <div>
            <label class="font-semibold text-slate-300 block mb-1">Chọn sản phẩm:</label>
            <select id="product_id" class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500">
              ${products.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="font-semibold text-slate-300 block mb-1">Mã License Key:</label>
            <input type="text" id="license_key" placeholder="Ví dụ: ALG-8899-78AB-90CD" value="ALG-8899-78AB-90CD" required class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-300 font-mono font-bold focus:outline-none focus:border-blue-500" />
            <p class="text-[11px] text-slate-400 mt-1">Mẹo kiểm tra: Các mã bắt đầu bằng <code class="text-blue-400">ALG-</code> đều hợp lệ trên môi trường thử nghiệm.</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Số tài khoản cTrader:</label>
              <input type="text" id="account_number" placeholder="1288590" value="1288590" required class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Sàn giao dịch (Broker):</label>
              <input type="text" id="broker" placeholder="IC Markets Global" value="IC Markets Global" class="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" id="submit-btn" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/30">
            Xác Thực Bản Quyền Ngay
          </button>
        </form>

        <!-- Result Box -->
        <div id="result-box" class="hidden rounded-2xl p-4 border text-xs font-mono space-y-2"></div>
      </div>
    </div>

    <script>
      document.getElementById('license-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        const box = document.getElementById('result-box');
        btn.disabled = true;
        btn.innerText = 'Đang xác thực trên Edge...';
        box.classList.add('hidden');

        try {
          const res = await fetch('/api/v1/license/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: document.getElementById('product_id').value,
              license_key: document.getElementById('license_key').value,
              account_number: document.getElementById('account_number').value,
              broker: document.getElementById('broker').value,
              environment: 'live',
              instance_id: 'WEB-TEST-' + Math.random().toString(36).substring(7),
              app_version: '2.1.0'
            })
          });

          const data = await res.json();
          box.classList.remove('hidden');

          if (data.valid) {
            box.className = 'rounded-2xl p-5 border bg-emerald-950/30 border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-2';
            box.innerHTML = \`
              <div class="font-bold text-sm text-emerald-400">✓ BẢN QUYỀN HỢP LỆ (STATUS: \${data.status.toUpperCase()})</div>
              <div>Sản phẩm: <span class="text-white">\${data.product_id}</span></div>
              <div>Hạn sử dụng: <span class="text-white">\${data.expires_at}</span></div>
              <div>Cache Valid Until: <span class="text-white">\${data.cache_until}</span></div>
              <div class="pt-2 border-t border-emerald-800/40">
                <span class="text-slate-400 block text-[10px]">Chữ ký số Server (Ed25519 / HMAC):</span>
                <span class="text-xs break-all text-blue-300">\${data.signature}</span>
              </div>
            \`;
          } else {
            box.className = 'rounded-2xl p-5 border bg-rose-950/30 border-rose-500/40 text-rose-300 text-xs font-mono space-y-2';
            box.innerHTML = \`
              <div class="font-bold text-sm text-rose-400">✗ BẢN QUYỀN TỪ CHỐI (\${data.code})</div>
              <div>Thông báo: \${data.message}</div>
            \`;
          }
        } catch (err) {
          box.classList.remove('hidden');
          box.className = 'rounded-2xl p-5 border bg-rose-950/30 border-rose-500/40 text-rose-300 text-xs font-mono';
          box.innerHTML = 'Lỗi kết nối máy chủ: ' + err.message;
        } finally {
          btn.disabled = false;
          btn.innerText = 'Xác Thực Bản Quyền Ngay';
        }
      });
    </script>
  `;

  return getBaseLayout({
    title: 'Kiểm Tra Bản Quyền cBot cTrader Trực Tuyến',
    description: 'Công cụ trực tuyến xác thực mã License Key của các cBot Alchemist, Grid EURGBP, Elliott Wave với chữ ký số Ed25519.',
    canonicalUrl: `${baseUrl}/license/validate`,
    content
  });
}

// -------------------------------------------------------------
// Trang giám sát Heartbeat (/license/heartbeat)
// -------------------------------------------------------------
export function renderHeartbeatPage(baseUrl: string): string {
  const content = `
    <div class="max-w-2xl mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Giám Sát Tín Hiệu Heartbeat</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Theo dõi tín hiệu giữ kết nối định kỳ giữa cTrader Automate Desktop và hệ thống ALP.
        </p>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Trạng thái kết nối máy chủ</span>
            <span class="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang hoạt động (Connected)
            </span>
          </div>
          <button id="ping-btn" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition">
            Gửi Tín Hiệu Heartbeat Thử
          </button>
        </div>

        <div id="heartbeat-log" class="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 space-y-1.5 max-h-64 overflow-y-auto">
          <div class="text-slate-500">// Nhật ký phản hồi Heartbeat từ Edge Worker...</div>
        </div>
      </div>
    </div>

    <script>
      async function sendHeartbeat() {
        const log = document.getElementById('heartbeat-log');
        const start = Date.now();
        try {
          const res = await fetch('/api/v1/license/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: 'GBPUSD_ALCHEMIST',
              license_key: 'ALG-8899-78AB-90CD',
              account_number: '1288590',
              instance_id: 'HEARTBEAT-MONITOR',
              app_version: '2.1.0'
            })
          });
          const latency = Date.now() - start;
          const data = await res.json();
          const entry = document.createElement('div');
          entry.innerHTML = \`<span class="text-emerald-400">[\${new Date().toLocaleTimeString()}]</span> Tín hiệu thành công: valid=\${data.valid}, status=\${data.status} (\${latency}ms)\`;
          log.prepend(entry);
        } catch (err) {
          const entry = document.createElement('div');
          entry.innerHTML = \`<span class="text-rose-400">[\${new Date().toLocaleTimeString()}]</span> Lỗi: \${err.message}\`;
          log.prepend(entry);
        }
      }

      document.getElementById('ping-btn').addEventListener('click', sendHeartbeat);
      // Auto ping once on load
      sendHeartbeat();
    </script>
  `;

  return getBaseLayout({
    title: 'Giám Sát Tín Hiệu Heartbeat',
    description: 'Giám sát kết nối thời gian thực và chu kỳ kiểm tra bản quyền giữa cBot cTrader và máy chủ ALP.',
    canonicalUrl: `${baseUrl}/license/heartbeat`,
    content
  });
}

// -------------------------------------------------------------
// Trang 404 Custom Error Page
// -------------------------------------------------------------
export function renderNotFoundPage(baseUrl: string): string {
  const content = `
    <div class="text-center py-16 sm:py-24 max-w-lg mx-auto space-y-6">
      <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto font-bold">
        404
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Không Tìm Thấy Trang Yêu Cầu</h1>
        <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Đường dẫn bạn vừa truy cập không tồn tại trên hệ thống hoặc đã được di chuyển.
        </p>
      </div>

      <div class="flex items-center justify-center gap-3">
        <a href="/" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30">
          Về Trang Chủ ALP
        </a>
        <a href="/products" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition">
          Xem Kho Sản Phẩm cBot
        </a>
      </div>
    </div>
  `;

  return getBaseLayout({
    title: '404 - Không Tìm Thấy Trang',
    description: 'Trang yêu cầu không tồn tại trên hệ thống ALP Algo License Platform.',
    canonicalUrl: `${baseUrl}/404`,
    content
  });
}
