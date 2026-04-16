using System;

namespace RetailApi.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Sentiment { get; set; } = "Neutral"; // Happy, Neutral, Concerned
        public string? AdminResponse { get; set; }
        
        public Product? Product { get; set; }
        public Order? Order { get; set; }
    }
}
