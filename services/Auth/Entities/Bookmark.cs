using System.ComponentModel.DataAnnotations;

namespace MyService.Entities
{
  public enum EntityType
  {
    Template,
    Project
  }

  public class Bookmark
  {
    [Key]
    public Guid Id { get; set; }

    public EntityType Entity { get; set; }

    public int Order { get; set; }

    public DateTime AddedAt { get; set; }

    public string? Label { get; set; }
  }
}