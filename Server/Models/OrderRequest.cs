namespace Server.Models
{
    public class OrderRequest
    {
        public decimal Total { get; set; }  // Total amount of the order
        public string Status { get; set; }  // Status of the order (e.g., "Pending", "Approved")
        public List<OrderItemRequest> Items { get; set; }  // List of items in the order
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }  // Product ID
        public int Quantity { get; set; }  // Quantity of the product
    }
}
