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

    public List<string> Tags { get; set; } = [];

    public string? Path { get; set; }

    public string? Description { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid UpdatedBy { get; set; }

    public Guid RelatedProjectId { get; set; }

    public List<Guid> UsedIn { get; set; } = [];
  }
}
