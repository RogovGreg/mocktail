using System.ComponentModel.DataAnnotations;

namespace Auth.Entities;

public class ApiToken
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? ExpiresAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation property
    public User User { get; set; } = null!;
}
