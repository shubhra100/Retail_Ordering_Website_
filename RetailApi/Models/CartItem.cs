namespace RetailApi.Models
{
    public class CartItem
    {
        public int CartId { get; set; } // Note: The user called it CartId in the schema table 5
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}
