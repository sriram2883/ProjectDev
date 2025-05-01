using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("int");  // Ensure Price is treated as an integer

            modelBuilder.Entity<Order>()
                .Property(o => o.Total)
                .HasColumnType("int");  // Ensure Total is treated as an integer

            // Seed Products (can be adjusted if needed)
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Laptop", Price = 1200, Category = "Electronics" },
                new Product { Id = 2, Name = "Smartphone", Price = 800, Category = "Electronics" },
                new Product { Id = 3, Name = "Headphones", Price = 150, Category = "Electronics" },
                new Product { Id = 4, Name = "Keyboard", Price = 100, Category = "Electronics" },
                new Product { Id = 5, Name = "Apple", Price = 1, Category = "Fruits" },
                new Product { Id = 6, Name = "Banana", Price = 1, Category = "Fruits" },
                new Product { Id = 7, Name = "Orange", Price = 2, Category = "Fruits" },
                new Product { Id = 8, Name = "Grapes", Price = 5, Category = "Fruits" },
                new Product { Id = 9, Name = "T-Shirt", Price = 20, Category = "Clothes" },
                new Product { Id = 10, Name = "Jeans", Price = 40, Category = "Clothes" },
                new Product { Id = 11, Name = "Jacket", Price = 60, Category = "Clothes" },
                new Product { Id = 12, Name = "Sneakers", Price = 50, Category = "Clothes" },
                new Product { Id = 13, Name = "Rice (1kg)", Price = 2, Category = "Groceries" },
                new Product { Id = 14, Name = "Sugar (1kg)", Price = 1, Category = "Groceries" },
                new Product { Id = 15, Name = "Flour (1kg)", Price = 1, Category = "Groceries" },
                new Product { Id = 16, Name = "Vegetable Oil (500ml)", Price = 3, Category = "Groceries" },
                new Product { Id = 17, Name = "Book: ReactJS Guide", Price = 30, Category = "Books" },
                new Product { Id = 18, Name = "Book: JavaScript Mastery", Price = 25, Category = "Books" },
                new Product { Id = 19, Name = "Sofa", Price = 400, Category = "Furniture" },
                new Product { Id = 20, Name = "Dining Table", Price = 250, Category = "Furniture" }
            );
        }
    }
}
