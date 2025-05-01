using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required] // Mark as required
    public string Username { get; set; }  // Add this if it's required

    [Required] // Mark as required
    public string PasswordHash { get; set; }  // Add this if it's required

    public string? Role { get; set; }  // Nullable if it's not required
}
