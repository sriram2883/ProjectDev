namespace Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime PlacedAt { get; set; }
        public decimal Total { get; set; }
        public List<OrderItem> Items { get; set; }
        public string Status { get; set; }
        public string Username { get; set; }  // We might use this for user identification
    }
}
