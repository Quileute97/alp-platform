# ALP – Algo License Platform

ALP (Algo License Platform) là nền tảng quản lý thuê bao, thanh toán, phân phối sản phẩm và cấp phép (licensing) độc lập dành riêng cho các sản phẩm giao dịch tự động trên **cTrader** (cBots và Indicators).

## Cấu trúc thư mục Monorepo

```text
TakeProfit/
├── apps/
│   ├── web/                     # Ứng dụng Frontend (React + Vite + Tailwind + shadcn/ui)
│   └── api/                     # Backend API (Cloudflare Workers + TypeScript)
├── packages/
│   ├── shared-types/            # Kiểu dữ liệu dùng chung (TypeScript models, contracts, DTOs)
│   └── api-contracts/           # OpenAPI specs & JSON schemas
├── ctrader/
│   ├── AlpLicenseManager/       # Module thư viện C# cho cTrader Automate
│   ├── SampleLicenseBot/        # cBot mẫu tích hợp xác thực license ALP
│   └── README.md
├── supabase/
│   ├── migrations/              # PostgreSQL schema, RLS policies, triggers
│   └── seed.sql                 # Dữ liệu khởi tạo (Sản phẩm mẫu, plans, tài khoản test)
├── docs/                        # Tài liệu kỹ thuật chi tiết
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   ├── CTRADER_INTEGRATION.md
│   └── DEVELOPMENT_STATUS.md
├── package.json                 # pnpm monorepo root
└── pnpm-workspace.yaml
```

## Yêu cầu môi trường
- Node.js >= 20.x (Hiện tại: v24.15.0)
- pnpm >= 9.x (Hiện tại: v10.33.2)
- .NET SDK (cho cTrader C# components, hiện tại: v10.0.204)
- Cloudflare Wrangler CLI (cho API worker)

