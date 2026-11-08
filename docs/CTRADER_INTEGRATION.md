# ALP – Algo License Platform: cTrader Integration Guide

## 1. Môi trường Thực thi (Execution Environment)

- Phiên bản mục tiêu hiện tại: **cTrader Desktop** (phiên bản 4.x đến 5.x) chạy trên Windows.
- Runtime: .NET 6.0 / .NET Framework (tương thích assembly `cAlgo.API.dll`).
- **Phân quyền truy cập mạng**:
  Để cBot gửi được request HTTP/HTTPS tới ALP License Server, cBot **bắt buộc** phải khai báo quyền truy cập đầy đủ trong thuộc tính Robot:
  ```csharp
  [Robot(TimeZone = TimeZones.UTC, AccessRights = AccessRights.FullAccess)]
  ```
  *(Nếu đặt `AccessRights.None`, runtime sandbox của cTrader sẽ chặn hoàn toàn các lệnh gọi WebRequest/HttpClient).*

> [!NOTE]
> Không công bố tính tương thích với **cTrader Cloud Execution** cho tới khi Spotware cung cấp cơ chế bảo mật outbound HTTP được kiểm chứng đầy đủ trên môi trường đám mây của họ.

---

## 2. Giao diện Module `AlpLicenseManager`

Thư viện chuẩn C# được thiết kế dùng chung cho mọi cBot và Indicator:

```csharp
namespace Alp.LicenseClient
{
    public interface IAlgoLicenseManager
    {
        Task<LicenseValidationResult> ValidateAsync();
        Task<LicenseValidationResult> HeartbeatAsync();
        bool IsAuthorized { get; }
        LicenseStatus Status { get; }
        DateTime? ExpiresAt { get; }
    }
}
```

---

## 3. Nguyên tắc An toàn Giao dịch (Trading Safety Rules)

1. **Khi License hết hạn (`LICENSE_EXPIRED`)**:
   - cBot lập tức kích hoạt cờ `IsAuthorized = false`.
   - Chặn tuyệt đối việc mở vị thế mới (`ExecuteMarketOrder`, `PlaceLimitOrder`, `PlaceStopOrder`).
   - **TUYỆT ĐỐI KHÔNG tự ý đóng (close) các vị thế đang chạy của khách hàng**. Việc ép đóng lệnh cưỡng bức có thể gây cháy tài khoản hoặc biến lỗ tạm thời thành lỗ thực tế khi spread thị trường đang giãn mạnh.
   - Vẫn duy trì cơ chế bảo vệ hiện hữu (Stop Loss, Take Profit, Trailing Stop) cho các vị thế đã mở từ trước.
   - Thông báo rõ ràng lý do trên màn hình đồ thị và log cTrader: *"Bản quyền ALP đã hết hạn. Bot dừng vào lệnh mới nhưng vẫn duy trì bảo vệ các vị thế đang mở."*

2. **Khi Mất Kết Nối Mạng hoặc Server Bảo Trì (Grace Period)**:
   - cBot kiểm tra bộ nhớ đệm đã được ký số (Signed Cache) lưu trên máy cục bộ.
   - Nếu phản hồi có chữ ký hợp lệ trước đó vẫn còn trong khoảng thời gian ân hạn (Grace Period, ví dụ 24-72 giờ), cBot tiếp tục cho phép giao dịch bình thường.
   - Nếu nhận được mã thu hồi bản quyền (`LICENSE_REVOKED`), cBot dừng vào lệnh ngay lập tức và hủy bỏ mọi bộ nhớ đệm.

