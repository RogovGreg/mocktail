using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace MyService.Models
{
  public class Template
  {
    [Key]
    public Guid Id { get; set; }

    [Column(TypeName = "jsonb")]
    public JsonDocument Schema { get; set; } = default!;

    [Required]
    public string Name { get; set; } = default!;

    [Required]
    public List<string> KeyWords { get; set; } = new();

    public string? Description { get; set; }

    public List<Release> Releases { get; set; } = new();

    public DateTime UpdatedAt { get; set; }

    public Guid RelatedProjectId { get; set; }

    public List<Guid> UsedIn { get; set; } = new();
  }

  public class Release
  {
    [Required]
    public Guid Author { get; set; }

    public DateTime CreatedAt { get; set; }

    [Required]
    public string Comment { get; set; } = default!;

    public int Version { get; set; }

    [Required]
    public Change Changes { get; set; } = default!;
  }

  public class Change
  {
    [Required]
    public string Name { get; set; } = default!;

    public string? Description { get; set; }

    [Required]
    public List<string> KeyWords { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public JsonDocument Schema { get; set; } = default!;
  }
}
