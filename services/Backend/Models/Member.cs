using System;
using System.ComponentModel.DataAnnotations;

namespace MyService.Models
{
  public enum MemberRole
  {
    Manager,
    Owner,
    Engineer,
    Viewer
  }

  public class Member
  {
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public MemberRole Role { get; set; }

    public DateTime JoiningDate { get; set; }

    public bool Active { get; set; }
  }
}
