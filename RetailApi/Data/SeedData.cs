using Microsoft.EntityFrameworkCore;
using RetailApi.Models;

namespace RetailApi.Data
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasData(
                new Product { ProductId = 1, Name = "Artisan Sourdough", Category = "Breads", Price = 8.50m, Stock = 50, ImageUrl = "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?w=500", IsFeatured = true, IsVegan = true },
                new Product { ProductId = 2, Name = "Chocolate Croissant", Category = "Pastries", Price = 4.50m, Stock = 40, ImageUrl = "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=500", IsFeatured = true },
                new Product { ProductId = 3, Name = "Honey Almond Cake", Category = "Cakes", Price = 28.00m, Stock = 30, ImageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", IsFeatured = true, IsTrending = true, IsGlutenFree = true },
                new Product { ProductId = 4, Name = "Artisan Coffee", Category = "Drinks", Price = 4.20m, Stock = 5, ImageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500", IsTrending = true },
                new Product { ProductId = 5, Name = "Blueberry Muffin", Category = "Pastries", Price = 3.80m, Stock = 100, ImageUrl = "https://images.unsplash.com/photo-1607958674115-05b148586235?w=500", IsTrending = true, IsVegan = true }
            );
        }
    }
}
