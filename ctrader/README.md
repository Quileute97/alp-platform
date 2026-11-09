# ALP cTrader Automate C# Integration

Thư mục này chứa module tích hợp bản quyền độc lập cho các robot giao dịch (cBots) và chỉ báo kỹ thuật (Indicators) trên nền tảng cTrader.

## 1. Cấu trúc thư mục
- `AlpLicenseManager/`: Thư viện Class Library C# (`netstandard2.0` / .NET 6+) đóng gói logic gọi API, xác thực chữ ký, quản lý trạng thái bản quyền và Grace Period.
- `SampleLicenseBot/`: Mã nguồn cBot mẫu minh họa cách nhúng `AlpLicenseManager` vào hàm `OnStart()` và `OnTick()`.

## 2. Nguyên tắc An toàn Giao dịch
- Khi license hết hạn: Robot chỉ chuyển cờ `CanOpenNewPositions = false`.
- **Tuyệt đối không đóng lệnh tự động**: Robot không bao giờ gọi hàm `ClosePosition()` hàng loạt khi bản quyền hết hạn để bảo vệ an toàn tối đa cho tài khoản khách hàng.
- Quyền truy cập: Yêu cầu khai báo `AccessRights = AccessRights.FullAccess` trên cTrader để thực hiện outbound HTTPS request.

