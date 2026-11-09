# ALP – Algo License Platform: Hướng Dẫn Triển Khai (Deployment Guide)

Tài liệu này hướng dẫn chi tiết cách cấu hình và triển khai nền tảng ALP trên **Cloudflare** và **Supabase**, đặc biệt là cách xử lý cấu trúc **Monorepo** để Cloudflare nhận diện chính xác từng dự án.

---

## 1. Xử Lý Lỗi Cloudflare Application Detection Trong Monorepo

### Nguyên nhân lỗi:
```text
The Cloudflare application detection logic has been run in the root of a workspace instead of targeting a specific project.
Change your working directory to one of the applications in the workspace and try again.
```
- Kho lưu trữ `Quileute97/alp-platform` là một **Monorepo** chứa nhiều phân hệ:
  - `apps/web`: Giao diện người dùng React Vite (triển khai trên **Cloudflare Pages**).
  - `apps/api`: Edge API Worker Hono (triển khai trên **Cloudflare Workers**).
  - `packages/shared-types`: Thư viện kiểu dữ liệu dùng chung.
- Khi kết nối Git, Cloudflare mặc định chạy lệnh kiểm tra tại thư mục gốc (`/`) nên không thể tự động đoán được bạn muốn deploy Web hay Worker.

---

## 2. Cấu Hình Triển Khai Cho Frontend (`apps/web`) Trên Cloudflare Pages

### Các bước thực hiện:
1. Truy cập **Cloudflare Dashboard** &gt; **Compute (Workers & Pages)** &gt; **Pages** &gt; **Create a project**.
2. Chọn **Connect to Git** &gt; Chọn repository **`Quileute97/alp-platform`**.
3. Tại màn hình **Set up builds and deployments**, cấu hình chính xác các mục sau:

| Mục cấu hình | Giá trị thiết lập | Ghi chú |
|---|---|---|
| **Project name** | `alp-web` | Tên trang web của bạn |
| **Production branch** | `main` | Nhánh Git tự động kích hoạt deploy |
| **Framework preset** | `Vite` | Chọn Vite từ danh sách |
| **Root directory (QUAN TRỌNG)** | `apps/web` | **Bắt buộc nhập `apps/web`** để Cloudflare vào đúng thư mục |
| **Build command** | `pnpm build` | Hoặc `pnpm --filter @alp/shared-types build && pnpm build` |
| **Build output directory** | `dist` | Thư mục chứa tệp tĩnh sau khi build |

4. Thêm các **Environment Variables (Biến môi trường)**:
   - `VITE_SUPABASE_URL`: `https://fnyonwdojxkchbrqrcpu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Mã publishable anon key từ Supabase.
   - `VITE_API_BASE_URL`: URL của Backend API (ví dụ: `https://alp-api.<your-subdomain>.workers.dev/api/v1`).
5. Nhấn **Save and Deploy**.

---

## 3. Cấu Hình Triển Khai Cho Backend API (`apps/api`) Trên Cloudflare Workers

Bạn có thể chọn 1 trong 2 phương pháp triển khai:

### Phương pháp 1: Kết nối Git CI/CD từ Cloudflare Dashboard (Khuyên dùng)
1. Vào **Cloudflare Dashboard** &gt; **Workers & Pages** &gt; **Create application** &gt; **Worker**.
2. Chọn **Connect to Git** &gt; Chọn repository **`Quileute97/alp-platform`**.
3. Tại phần **Build configurations**:
   - **Root directory**: `apps/api`
   - **Deploy command**: `npx wrangler deploy` (hoặc để mặc định khi Root directory là `apps/api`).
   *(Hoặc nếu để Root directory là `/`, hãy đặt Deploy command là: `npx wrangler deploy --config apps/api/wrangler.toml`)*.
4. Cấu hình **Variables and Secrets**:
   - `SUPABASE_URL`: `https://fnyonwdojxkchbrqrcpu.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role secret key từ Supabase.
   - `ED25519_PRIVATE_KEY`: Khóa bí mật ký số bản quyền license.
   - `WEBHOOK_SIGNING_SECRET`: Chuỗi bảo mật xác thực webhook thanh toán.

### Phương pháp 2: Triển khai trực tiếp qua terminal máy trạm (Wrangler CLI)
Từ thư mục dự án `TakeProfit`, chạy:
```bash
# Triển khai trực tiếp qua lệnh đã cấu hình sẵn ở root
pnpm deploy:api

# Hoặc di chuyển vào thư mục API
cd apps/api
npx wrangler deploy
```

---

## 4. Triển Khai Cơ Sở Dữ Liệu Supabase

Dự án đã chuẩn bị sẵn các migration SQL trong thư mục `supabase/migrations/`:
1. Mở trang quản trị **Supabase Dashboard** của dự án `fnyonwdojxkchbrqrcpu` &gt; **SQL Editor**.
2. Thực thi tuần tự các tệp:
   - `supabase/migrations/20261108000001_initial_schema.sql` (Tạo 14 bảng quan hệ, khóa ngoại, partial unique indexes).
   - `supabase/migrations/20261108000002_rls_policies.sql` (Bật Row Level Security và phân quyền truy cập).
   - `supabase/migrations/20261108000003_functions_and_triggers.sql` (Triggers thời gian và hàm nguyên tử `fulfill_order`).
   - `supabase/seed.sql` (Nạp dữ liệu các gói chu kỳ, cBot mẫu và giá khởi tạo).
