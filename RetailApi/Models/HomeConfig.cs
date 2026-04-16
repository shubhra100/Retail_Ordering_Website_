namespace RetailApi.Models
{
    public class HomeConfig
    {
        public int Id { get; set; }
        public string AnnouncementText { get; set; } = "Welcome to our Artisan Bakery!";
        public string HeroTitle { get; set; } = "The Art of Traditional Baking";
        public string HeroSubtitle { get; set; } = "Handcrafted with passion, delivered with love.";
        public string HeroImageUrl { get; set; } = "";
        public string CtaText { get; set; } = "Order Now";
    }
}
