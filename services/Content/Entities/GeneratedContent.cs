using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Content.Entities;

public class GeneratedContent
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid TemplateId { get; set; }

    [Required]
    public int TemplateVersion { get; set; }

    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    [MaxLength(500)]
    public string EndpointPath { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [Column(TypeName = "jsonb")]
    public string GeneratedData { get; set; } = string.Empty;

    [Required]
    public string Schema { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    // Navigation properties (if needed for future queries)
    public string TemplateName { get; set; } = string.Empty;
    public string ProjectTitle { get; set; } = string.Empty;
}
