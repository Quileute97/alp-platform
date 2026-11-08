# ALP – Algo License Platform: Security Architecture

Bảo mật là tiêu chí cốt lõi trong thiết kế nền tảng ALP.

## 1. Cơ chế Chống Giả Mạo Bản Quyền (License Tamper-Proofing)

### Ký số Bất Đối Xứng Ed25519
1. **Server Private Key**: Chỉ được lưu trữ duy nhất trong Cloudflare Secrets của Worker Backend (`ED25519_PRIVATE_KEY`). Tuyệt đối không bao giờ xuất hiện ở mã nguồn Frontend hoặc cBot.
2. **Client Public Key**: Được nhúng thẳng vào thư viện C# `AlpLicenseManager`.
3. **Canonical Payload Signing**: Server định dạng payload gồm `valid`, `product_id`, `account_number`, `expires_at`, `server_time`, sau đó tạo chữ ký Ed25519 gắn kèm vào response.
4. cBot dùng Public Key để kiểm tra chữ ký. Nếu chữ ký không khớp hoặc dữ liệu bị sửa đổi (ví dụ sửa ngày hết hạn), cBot lập tức từ chối chạy.

### Hash License Key (SHA-256)
- Không lưu mã kích hoạt gốc trong cơ sở dữ liệu.
- Server tính `hash = SHA256(license_key + salt)` và chỉ lưu giá trị băm này trong bảng `licenses`.
- Khi cBot gửi request validate, backend băm chuỗi key nhận được và so khớp với `license_key_hash`.

## 2. Bảo mật Dữ liệu & Phân quyền Supabase

- **Row Level Security (RLS)** được kích hoạt 100% trên toàn bộ các bảng.
- Không bao giờ cấp quyền `service_role` cho Frontend.
- Chặn người dùng tự nâng quyền: RLS Policy trên bảng `profiles` kiểm tra nghiêm ngặt `role` của người dùng; chỉ tài khoản có role `admin` hoặc `super_admin` mới có quyền can thiệp vào trường dữ liệu này.

## 3. Bảo vệ Tệp Tải Về (.algo Files)

- Tệp binary cBot / Indicator không được để ở thư mục công khai (public bucket).
- Tệp được lưu trữ trong Private Storage.
- Khi khách hàng nhấn tải xuống:
  1. API kiểm tra bảng `entitlements` xem khách hàng có quyền sở hữu hợp lệ hay không.
  2. Nếu hợp lệ, hệ thống tạo một URL có chữ ký (Signed URL) với thời gian hết hạn ngắn (5 phút).
  3. Ghi lại nhật ký lượt tải vào `audit_logs`.

## 4. An toàn Webhook Thanh toán

- Xác minh mã chữ ký HMAC hoặc token bí mật trên mỗi lượt gọi webhook từ cổng thanh toán.
- Kiểm tra tính duy nhất qua bảng `payment_events (provider, provider_event_id)` để chống tấn công phát lại (Replay Attacks) hoặc lỗi cộng dồn tiền nhiều lần.
- Không bao giờ coi chuyển hướng trang cảm ơn (Redirect URL) là căn cứ thanh toán thành công.

