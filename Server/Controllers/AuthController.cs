using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;  // Correct BCrypt.Net package
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // Register Method
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            // Validate user input
            if (string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Check if the user already exists
            if (await _context.Set<User>().AnyAsync(u => u.Username == userDto.Username))
            {
                return BadRequest("Username already exists.");
            }

            // Hash password before saving
            var user = new User
            {
                Username = userDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password) // Correct method name from BCrypt.Net-Next
            };

            await _context.Set<User>().AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        // Login Method
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto userDto)
        {
            if (string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Password))
                return BadRequest("Username and password are required.");

            var user = await _context.Set<User>().SingleOrDefaultAsync(u => u.Username == userDto.Username);

            if (user == null)
            {
                Console.WriteLine("User not found.");
                return Unauthorized("Invalid credentials.");
            }

            Console.WriteLine($"Input password: {userDto.Password}");
            Console.WriteLine($"Stored hash: {user.PasswordHash}");

            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash);
            Console.WriteLine($"Verify result: {isPasswordCorrect}");

            if (!isPasswordCorrect)
                return Unauthorized("Invalid credentials.");

            var token = _jwtService.GenerateToken(user);
            return Ok(new { token });
        }

    }
        // UserDto class for Registration and Login
        public class UserDto
    {
        public required string Username { get; set; } // Added 'required' modifier
        public required string Password { get; set; } // Added 'required' modifier
    }
}
