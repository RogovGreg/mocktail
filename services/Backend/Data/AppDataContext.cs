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

      modelBuilder.Entity<Template>(t =>
      {
        t.OwnsMany(x => x.Releases, r =>
              {
                r.WithOwner().HasForeignKey("TemplateId");
                r.HasKey("TemplateId", "Author", "CreatedAt");

                r.OwnsOne(x => x.Changes, c =>
                      {
                        c.Property(p => p.Name).IsRequired();
                        c.Property(p => p.Schema).IsRequired();
                        c.Property(p => p.Description);
                        c.Property(p => p.KeyWords);
                      });
              });
      });
    }
  }
}
