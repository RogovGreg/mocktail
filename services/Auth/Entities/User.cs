using Microsoft.AspNetCore.Identity;
using MyService.Entities;

namespace Auth.Entities;

public class User : IdentityUser
{
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public byte[]? Avatar { get; set; }

    public List<Guid> Projects { get; set; } = new();

    public List<Bookmark> Bookmarks { get; set; } = new();

    public string? About { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
