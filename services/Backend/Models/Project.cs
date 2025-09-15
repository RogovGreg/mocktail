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

    public List<Guid> Templates { get; set; } = [];

    public bool WithMockServer { get; set; } = false;

    public List<Guid> Members { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid UpdatedBy { get; set; }
  }
}