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
            // Validate user input
            if (string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Password))
            {
                return BadRequest("Username and password are required.");
            }

            var user = await _context.Set<User>().SingleOrDefaultAsync(u => u.Username == userDto.Username);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash);

            if (!isPasswordCorrect)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Check if the user is logging in as an admin
            if (userDto.LoginAsAdmin && user.Role != "admin")
            {
                return Unauthorized("You do not have permission to log in as an admin.");
            }

            // Generate JWT token
            var token = _jwtService.GenerateToken(user);
            return Ok(new { token, role = user.Role });
        }
    }

    // UserDto class for Registration and Login
    public class UserDto
    {
        public string Username { get; set; }  // No need for 'required' as it's handled by validation logic
        public string Password { get; set; }  // No need for 'required' as it's handled by validation logic
        public bool LoginAsAdmin { get; set; }  // Add LoginAsAdmin to handle admin login requests
    }
}
