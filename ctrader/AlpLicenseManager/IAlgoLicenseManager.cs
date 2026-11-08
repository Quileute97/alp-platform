using System;
using System.Threading.Tasks;

namespace Alp.LicenseClient
{
    public enum LicenseStatus
    {
        Pending,
        Active,
        Suspended,
        Expired,
        Revoked,
        Invalid
    }

    public class LicenseValidationResult
    {
        public bool IsValid { get; set; }
        public LicenseStatus Status { get; set; }
        public string? ProductId { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime? CacheUntil { get; set; }
        public string? ErrorCode { get; set; }
        public string? Message { get; set; }
        public bool IsGracePeriodActive { get; set; }
    }

    public interface IAlgoLicenseManager
    {
        Task<LicenseValidationResult> ValidateAsync();

        Task<LicenseValidationResult> HeartbeatAsync();

        bool IsAuthorized { get; }

        LicenseStatus Status { get; }

        DateTime? ExpiresAt { get; }

        bool CanOpenNewPositions { get; }
    }
}
