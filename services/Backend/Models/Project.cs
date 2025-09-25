

using System;
using System.ComponentModel.DataAnnotations;

namespace MyService.Models
{
  public class Project
  {
    [Key]
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public string[] KeyWords { get; set; } = Array.Empty<string>();

    public string? Description { get; set; }

    public byte[]? Logo { get; set; }

    public Guid[] Templates { get; set; } = Array.Empty<Guid>();

    public bool WithMockServer { get; set; } = false;

    public Guid[] Members { get; set; } = Array.Empty<Guid>();

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid UpdatedBy { get; set; }
  }
}