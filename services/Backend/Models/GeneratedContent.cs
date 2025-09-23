using System.ComponentModel.DataAnnotations;

namespace MyService.Models
{
  public class GeneratedContent
  {
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid TemplateId { get; set; }

    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    [MaxLength(500)]
    public string EndpointPath { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    // Navigation properties
    public Template Template { get; set; } = null!;
    public Project Project { get; set; } = null!;
  }
}
