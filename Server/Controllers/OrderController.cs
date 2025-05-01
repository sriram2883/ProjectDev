using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Security.Claims;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET /api/Order - Get orders for logged-in user (from token)
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserOrders()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username not found in token.");

            var orders = await _context.Orders
                .Where(o => o.Username == username)
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }

        // ✅ POST /api/Order - Place a new order
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderRequest orderRequest)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            var order = new Order
            {
                Username = username,
                PlacedAt = DateTime.UtcNow,
                Total = orderRequest.Total,
                Status = orderRequest.Status,
                Items = new List<OrderItem>()
            };

            foreach (var item in orderRequest.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Product with ID {item.ProductId} not found.");

                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Product = product,
                    Quantity = item.Quantity,
                    Price = product.Price * item.Quantity
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // ✅ PUT /api/Order/{id} - Update order status
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Order not found.");

            order.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
