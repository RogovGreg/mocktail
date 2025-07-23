using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Backend.Utils;
using MyService.Models;

namespace MyService.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Template> Templates { get; set; } = null!;

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
      var now = DateTimeOffset.UtcNow.UtcDateTruncateToMilliseconds();

      foreach (var entry in ChangeTracker.Entries<Template>())
      {
        switch (entry.State)
        {
          case EntityState.Added:
            entry.Entity.CreatedAt = now;
            entry.Entity.UpdatedAt = now;
            break;

          case EntityState.Modified:
            entry.Property(p => p.CreatedAt).IsModified = false;
            entry.Entity.UpdatedAt = now;
            break;
        }
      }
      return await base.SaveChangesAsync(ct);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      var utcConverter = new ValueConverter<DateTimeOffset, DateTimeOffset>(
          v => v.UtcDateTruncateToMilliseconds(),
          v => v.UtcDateTruncateToMilliseconds());

      modelBuilder.Entity<Template>(b =>
      {
        b.Property(p => p.CreatedAt)
        .HasConversion(utcConverter);

        b.Property(p => p.UpdatedAt)
        .HasConversion(utcConverter);
      });
    }
  }
}
