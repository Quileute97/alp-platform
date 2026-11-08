using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Alp.LicenseClient
{
    public class AlpLicenseManager : IAlgoLicenseManager
    {
        private readonly string _apiBaseUrl;
        private readonly string _productId;
        private readonly string _licenseKey;
        private readonly string _accountNumber;
        private readonly string _broker;
        private readonly string _environment;
        private readonly string _appVersion;
        private readonly string _instanceId;
        private readonly HttpClient _httpClient;

        private LicenseStatus _status = LicenseStatus.Pending;
        private DateTime? _expiresAt;
        private bool _isAuthorized = false;

        public bool IsAuthorized => _isAuthorized;
        public LicenseStatus Status => _status;
        public DateTime? ExpiresAt => _expiresAt;

        // TRADING SAFETY RULE: If license expires, prevent NEW trades but preserve existing trades!
        public bool CanOpenNewPositions => _isAuthorized && _status == LicenseStatus.Active;

        public AlpLicenseManager(
            string apiBaseUrl,
            string productId,
            string licenseKey,
            string accountNumber,
            string broker = "Unknown Broker",
            string environment = "live",
            string appVersion = "1.0.0")
        {
            _apiBaseUrl = apiBaseUrl?.TrimEnd('/') ?? "https://api.yourdomain.com/api/v1";
            _productId = productId;
            _licenseKey = licenseKey;
            _accountNumber = accountNumber;
            _broker = broker;
            _environment = environment;
            _appVersion = appVersion;
            _instanceId = Guid.NewGuid().ToString("N");

            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(10)
            };
        }

        public async Task<LicenseValidationResult> ValidateAsync()
        {
            try
            {
                var requestBody = $"{{\"product_id\":\"{_productId}\",\"license_key\":\"{_licenseKey}\",\"account_number\":\"{_accountNumber}\",\"broker\":\"{_broker}\",\"environment\":\"{_environment}\",\"instance_id\":\"{_instanceId}\",\"app_version\":\"{_appVersion}\"}}";
                var content = new StringContent(requestBody, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_apiBaseUrl}/license/validate", content);
                var json = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode && json.Contains("\"valid\":true"))
                {
                    _status = LicenseStatus.Active;
                    _isAuthorized = true;
                    _expiresAt = DateTime.UtcNow.AddDays(30);

                    return new LicenseValidationResult
                    {
                        IsValid = true,
                        Status = LicenseStatus.Active,
                        ProductId = _productId,
                        ExpiresAt = _expiresAt
                    };
                }

                // If explicitly rejected
                _status = json.Contains("LICENSE_EXPIRED") ? LicenseStatus.Expired : LicenseStatus.Invalid;
                _isAuthorized = false;

                return new LicenseValidationResult
                {
                    IsValid = false,
                    Status = _status,
                    ProductId = _productId,
                    Message = "Bản quyền ALP không hợp lệ hoặc đã hết hạn."
                };
            }
            catch (Exception ex)
            {
                // Grace Period logic when API is unreachable
                return new LicenseValidationResult
                {
                    IsValid = false,
                    Status = LicenseStatus.Pending,
                    ErrorCode = "API_UNAVAILABLE",
                    Message = $"Không thể kết nối máy chủ bản quyền ALP: {ex.Message}"
                };
            }
        }

        public async Task<LicenseValidationResult> HeartbeatAsync()
        {
            try
            {
                var requestBody = $"{{\"product_id\":\"{_productId}\",\"license_key\":\"{_licenseKey}\",\"account_number\":\"{_accountNumber}\",\"instance_id\":\"{_instanceId}\",\"app_version\":\"{_appVersion}\"}}";
                var content = new StringContent(requestBody, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_apiBaseUrl}/license/heartbeat", content);
                if (response.IsSuccessStatusCode)
                {
                    return new LicenseValidationResult { IsValid = true, Status = _status };
                }
            }
            catch
            {
                // Soft fail on heartbeat to prevent network jitter dropping active bots
            }

            return new LicenseValidationResult { IsValid = _isAuthorized, Status = _status };
        }
    }
}
