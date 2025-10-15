using System.ComponentModel.DataAnnotations;

namespace Generator.Entities;

public class ProjectConfig
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ProjectId { get; set; }

    [MaxLength(200)]
    public string OpenAiKey { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;
}
