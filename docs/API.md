# ALP – Algo License Platform: API Specification

Các API được quản lý theo phiên bản chuẩn hóa dưới tiền tố: `/api/v1/`

## 1. Public APIs

### `GET /api/v1/products`
Lấy danh sách các sản phẩm Algo đang hoạt động (`status = 'active'`).
- **Response**: Mảng đối tượng `Product[]` kèm giá gói mặc định.

### `GET /api/v1/products/:slug`
Xem chi tiết một sản phẩm theo slug (ví dụ: `gbpusd-alchemist-cbot`).

### `GET /api/v1/products/:id/plans`
Lấy danh sách các gói thanh toán (`ProductPlan[]`) của sản phẩm.

---

## 2. Customer APIs (Yêu cầu Bearer Token)

### `POST /api/v1/checkout`
Khởi tạo đơn hàng thanh toán cho 1 hoặc nhiều sản phẩm/gói thuê bao.
- **Payload**:
  ```json
  {
    "product_id": "GBPUSD_ALCHEMIST",
    "product_plan_id": "uuid-here",
    "payment_method": "vietqr"
  }
  ```
- **Response**: `Order` kèm thông tin thanh toán (QR code URL hoặc cổng thanh toán).

### `GET /api/v1/customer/orders`
Danh sách đơn hàng của khách hàng hiện tại.

### `GET /api/v1/customer/subscriptions`
Danh sách gói thuê bao còn hiệu lực hoặc đã hết hạn của khách hàng.

### `GET /api/v1/customer/accounts`
Danh sách tài khoản cTrader đã khai báo.

### `POST /api/v1/customer/accounts`
Đăng ký thêm tài khoản cTrader mới:
```json
{
  "broker": "IC Markets",
  "account_number": "12345678",
  "environment": "live"
}
```

### `GET /api/v1/customer/licenses`
Danh sách license thuộc sở hữu của khách hàng.

### `POST /api/v1/customer/licenses/:id/rebind-request`
Yêu cầu đổi tài khoản cTrader liên kết với license (giới hạn theo chính sách nền tảng).

### `GET /api/v1/customer/downloads`
Lấy danh sách đường dẫn tải về các cBot / Indicator đã mua kèm chữ ký URL tạm thời (Signed URL).

---

## 3. License APIs (Dành riêng cho cTrader Algo)

### `POST /api/v1/license/validate`
Xác thực bản quyền khi khởi động cBot (`OnStart()`).
- **Request Payload**:
  ```json
  {
    "product_id": "GBPUSD_ALCHEMIST",
    "license_key": "ALG-78AB-90CD-12EF",
    "account_number": "12345678",
    "broker": "IC Markets",
    "environment": "live",
    "instance_id": "INST-550e8400-e29b-41d4-a716-446655440000",
    "app_version": "2.1.0"
  }
  ```
- **Thành công (200 OK)**:
  ```json
  {
    "valid": true,
    "status": "active",
    "product_id": "GBPUSD_ALCHEMIST",
    "expires_at": "2027-11-08T00:00:00Z",
    "server_time": "2026-11-08T15:00:00Z",
    "cache_until": "2026-11-09T15:00:00Z",
    "signature": "MEYCIQCcXyZ..."
  }
  ```
- **Thất bại (200 hoặc 403)**:
  ```json
  {
    "valid": false,
    "code": "LICENSE_EXPIRED",
    "message": "Bản quyền của bạn đã hết hạn. Vui lòng gia hạn trên website."
  }
  ```

### `POST /api/v1/license/heartbeat`
Duy trì tín hiệu hoạt động định kỳ (mặc định mỗi 1-4 giờ) để cập nhật `last_seen_at` của instance.

---

## 4. Payment APIs

### `POST /api/v1/payment/webhooks/:provider`
Nhận thông báo thanh toán tự động từ cổng thanh toán (ví dụ: VietQR, Stripe).
- Xác minh chữ ký số của Provider.
- Kiểm tra tính Idempotent qua `provider_event_id`.
- Tự động gọi `fulfill_order` kích hoạt thuê bao và license.

---

## 5. Admin APIs (Yêu cầu vai trò Admin/Super Admin)

- `GET /api/v1/admin/dashboard`: Thống kê tổng quan KPI, doanh thu, license.
- `GET /api/v1/admin/products`: Danh sách tất cả sản phẩm.
- `POST /api/v1/admin/products`: Tạo mới sản phẩm.
- `PATCH /api/v1/admin/products/:id`: Chỉnh sửa sản phẩm.
- `GET /api/v1/admin/customers`: Quản lý danh sách khách hàng.
- `GET /api/v1/admin/licenses`: Tra cứu license toàn hệ thống.
- `POST /api/v1/admin/licenses/:id/revoke`: Thu hồi bản quyền.
- `POST /api/v1/admin/licenses/:id/suspend`: Tạm ngưng bản quyền.
- `POST /api/v1/admin/licenses/:id/extend`: Gia hạn thủ công bản quyền.
- `POST /api/v1/admin/licenses/:id/rebind`: Đổi số tài khoản cTrader liên kết.
- `GET /api/v1/admin/audit-logs`: Truy vết hành động quản trị.

