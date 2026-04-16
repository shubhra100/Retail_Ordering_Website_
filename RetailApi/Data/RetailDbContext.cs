using Microsoft.EntityFrameworkCore;
using RetailApi.Models;

namespace RetailApi.Data
{
    public class RetailDbContext : DbContext
    {
        public RetailDbContext(DbContextOptions<RetailDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<HomeConfig> HomeConfigs { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed Homepage Config
            modelBuilder.Entity<HomeConfig>().HasData(
                new HomeConfig { 
                    Id = 1, 
                    AnnouncementText = "Welcome to our Artisan Bakery!", 
                    HeroTitle = "The Art of Traditional Baking", 
                    HeroSubtitle = "Handcrafted with passion, delivered with love.",
                    HeroImageUrl = "gourmet_bakery_hero_1776327260463.png", // Reinstating original Hero
                    CtaText = "Order Now"
                }
            );

            // Configure Relationships
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<CartItem>()
                .HasKey(c => c.CartId);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.Product)
                .WithMany()
                .HasForeignKey(c => c.ProductId);

            // Seed Products
            SeedData.Seed(modelBuilder);

            // Seed Admin User
            // Note: Password is 'admin123'
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Username = "admin", Email = "admin@retail.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin", Provider = "Local" }
            );
        }
    }
}
