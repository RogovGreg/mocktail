using Microsoft.EntityFrameworkCore;
using MyService.Models;

namespace MyService.Data
{
  public class AppDbContext : DbContext
  {
    public DbSet<Template> Templates { get; set; } = null!;

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Configure Template with owned Releases and Changes
      modelBuilder.Entity<Template>(t =>
      {
        // Owns many Release entities
        t.OwnsMany(x => x.Releases, r =>
              {
            r.WithOwner().HasForeignKey("TemplateId");
            r.HasKey("TemplateId", "Author", "CreatedAt");

                // Configure owned Change within Release
            r.OwnsOne(x => x.Changes, c =>
                  {
                c.Property(p => p.Name).IsRequired();
                c.Property(p => p.Schema).HasColumnType("jsonb");
                c.Property(p => p.Description);
                c.Property(p => p.KeyWords);
              });
          });
      });
    }
  }
}
