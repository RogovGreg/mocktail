

using System;
using System.ComponentModel.DataAnnotations;

namespace MyService.Models
{
  public class Project
  {
    [Key]
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string? Description { get; set; }

    public byte[]? Logo { get; set; }

    public List<Guid> templates { get; set; } = new();

    public bool WithMockServer { get; set; }

    public List<Guid> Members { get; set; } = new();

    public List<Guid>? Endpoints { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid UpdatedBy { get; set; }
  }
}