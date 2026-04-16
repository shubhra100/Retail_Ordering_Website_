namespace RetailApi.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Admin, Customer
        
        // Advanced Features
        public string? MfaSecret { get; set; }
        public bool IsMfaEnabled { get; set; }
        public string Provider { get; set; } = "Local"; // Local, Google, Apple
    }
}
