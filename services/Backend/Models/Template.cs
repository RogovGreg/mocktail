using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyService.Models
{
  public class Template
  {
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Schema { get; set; } = default!;

    [Required]
    public string Name { get; set; } = default!;

    public string[] Tags { get; set; } = Array.Empty<string>();

    public string? Path { get; set; }

    public string? Description { get; set; }

    [Required]
    public int Version { get; set; } = 1;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Draft"; // Draft, Published, Archived

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid UpdatedBy { get; set; }

    public Guid RelatedProjectId { get; set; }

    public Guid[] UsedIn { get; set; } = Array.Empty<Guid>();

    // Track the latest generated content version for this template
    public int? LatestGeneratedVersion { get; set; }

    // Track when content was last generated for this template
    public DateTimeOffset? LastGeneratedAt { get; set; }
  }
}
