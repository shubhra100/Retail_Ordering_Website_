namespace RetailApi.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool IsTrending { get; set; }

        // Advanced Features
        public bool IsVegan { get; set; }
        public bool IsGlutenFree { get; set; }
        public double AverageRating { get; set; } = 4.5;
        public int ReviewCount { get; set; } = 0;
    }
}
