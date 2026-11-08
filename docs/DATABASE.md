# ALP – Algo License Platform: Database Schema & Policies

## 1. Danh sách bảng dữ liệu (PostgreSQL)

| Bảng | Mục đích | RLS |
|---|---|---|
| `profiles` | Thông tin người dùng, vai trò (`customer`, `support`, `admin`, `super_admin`), trạng thái. | Có |
| `products` | Danh mục cBot, Indicator, Bundle cTrader. | Có (Public đọc active) |
| `product_versions` | Lịch sử phiên bản, release notes, đường dẫn tải file `.algo`. | Có |
| `plans` | Định nghĩa chu kỳ (`monthly`, `quarterly`, `semi_annual`, `yearly`, `lifetime`). | Có (Public đọc active) |
| `product_plans` | Bảng ma trận giá cho từng sản phẩm theo từng gói chu kỳ. | Có |
| `bundles` | Gói combo nhiều sản phẩm với mức giá ưu đãi. | Có |
| `bundle_products` | Quan hệ N-N giữa Bundle và Product. | Có |
| `memberships` | Gói thành viên truy cập kho sản phẩm. | Có |
| `membership_products` | Quan hệ N-N giữa Membership và Product. | Có |
| `orders` | Đơn hàng mua sản phẩm hoặc gia hạn. | Có (Chỉ chủ sở hữu + Admin) |
| `order_items` | Chi tiết sản phẩm trong đơn hàng. | Có |
| `payment_events` | Nhật ký webhook thanh toán, đảm bảo tính duy nhất (idempotency). | Có (Admin only) |
| `subscriptions` | Gói thuê bao của khách hàng, ngày bắt đầu và ngày hết hạn. | Có (Chủ sở hữu + Admin) |
| `trading_accounts` | Tài khoản cTrader (`broker`, `account_number`, `environment`). | Có (Chủ sở hữu + Admin) |
| `licenses` | Bản quyền kích hoạt, lưu `license_key_hash`, trạng thái và thời hạn. | Có (Chủ sở hữu + Admin) |
| `entitlements` | Quyền truy cập sản phẩm (hợp nhất từ subscription, bundle, membership). | Có (Chủ sở hữu + Admin) |
| `bot_instances` | Các phiên bản cBot đang chạy thực tế trên máy tính khách hàng. | Có |
| `license_events` | Sự kiện xác thực (`validate`, `heartbeat`, `reject`, `deactivate`). | Có (Admin/Staff only) |
| `audit_logs` | Nhật ký thao tác quản trị hệ thống. | Có (Admin/Staff only) |

## 2. Chiến lược Chỉ mục & Ràng buộc cốt lõi

1. **Partial Unique Index trên License**:
   ```sql
   CREATE UNIQUE INDEX idx_unique_active_product_account 
       ON public.licenses(product_id, trading_account_id) 
       WHERE status = 'active' AND trading_account_id IS NOT NULL;
   ```
   *Lý do:* Cho phép một tài khoản cTrader từng có nhiều license cũ (hết hạn hoặc bị thu hồi) của cùng 1 sản phẩm, nhưng tại một thời điểm chỉ có tối đa 1 license ở trạng thái `active`.

2. **Định danh duy nhất tài khoản giao dịch**:
   ```sql
   CONSTRAINT uq_customer_trading_account UNIQUE (user_id, broker, account_number, environment)
   ```
   *Lý do:* Một số tài khoản cTrader có thể trùng số ngẫu nhiên giữa các sàn (Broker) khác nhau hoặc giữa môi trường `demo` và `live`.

3. **Chống trùng lặp Webhook thanh toán (Idempotency)**:
   ```sql
   CONSTRAINT uq_provider_event UNIQUE (provider, provider_event_id)
   ```

4. **Bảo mật Hash License**:
   Cột `license_key_hash` lưu mã băm SHA-256. API tuyệt đối không trả về chuỗi hash này trong phản hồi cho khách hàng.

## 3. Row Level Security (RLS)

- Mọi truy vấn từ Frontend khách hàng bắt buộc tuân theo chính sách RLS:
  - Khách hàng chỉ có quyền `SELECT` và `INSERT` dữ liệu gắn liền với `auth.uid()`.
  - Khách hàng không thể thay đổi `role` hoặc `status` của tài khoản mình.
  - Mọi thao tác thay đổi trạng thái nhạy cảm (như phê duyệt thanh toán, kích hoạt license, sửa hạn sử dụng) đều được thực hiện qua các hàm bảo mật (Database Functions có `SECURITY DEFINER`) hoặc Backend API Worker được bảo vệ.

