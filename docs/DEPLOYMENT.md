# ALP – Algo License Platform: Deployment Guide

## 1. Biến Môi Trường (Environment Variables)

### Frontend (`apps/web/.env`)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### Backend (`apps/api/wrangler.toml` & Cloudflare Secrets)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # Cấp qua wrangler secret put
ED25519_PRIVATE_KEY=your-base64-encoded-private-key     # Cấp qua wrangler secret put
WEBHOOK_SIGNING_SECRET=your-webhook-secret              # Cấp qua wrangler secret put
```

---

## 2. Triển khai Cơ sở dữ liệu Supabase

Chạy tuần tự các tệp migration:
1. `supabase/migrations/20261108000001_initial_schema.sql`
2. `supabase/migrations/20261108000002_rls_policies.sql`
3. `supabase/migrations/20261108000003_functions_and_triggers.sql`
4. `supabase/seed.sql`

Hoặc sử dụng Supabase CLI:
```bash
npx supabase db push
```

---

## 3. Triển khai Cloudflare Workers (`apps/api`)

```bash
cd apps/api
npx wrangler deploy
```

---

## 4. Triển khai Web Frontend (`apps/web`)

```bash
cd apps/web
pnpm build
# Triển khai thư mục dist lên Cloudflare Pages, Vercel, hoặc Netlify
```

