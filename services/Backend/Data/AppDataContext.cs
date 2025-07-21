using Microsoft.EntityFrameworkCore;
using MyService.Models;
using System.Text.Json;
using System.Collections.Generic;

namespace MyService.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Template> Templates { get; set; } = null!;

    public override int SaveChanges()
    {
      Console.WriteLine("SaveChanges");
      UpdateTimestamps();
      return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
      Console.WriteLine("SaveChangesAsync");
      UpdateTimestamps();
      return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void UpdateTimestamps()
    {
      var utcNow = DateTime.UtcNow.ToUniversalTime();
      Console.WriteLine($"Updating timestamps at {utcNow}");

      foreach (var entry in ChangeTracker.Entries<Template>())
      {
        if (entry.State == EntityState.Added)
        {
          entry.Entity.CreatedAt = utcNow;
          entry.Entity.UpdatedAt = utcNow;
        }
        else if (entry.State == EntityState.Modified)
        {
          entry.Property(p => p.CreatedAt).IsModified = false;
          entry.Entity.UpdatedAt = utcNow;
        }
      }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      Console.WriteLine("OnModelCreating");
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<Template>(entity =>
      {
        entity.Property(e => e.KeyWords)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)!);

        entity.Property(e => e.UsedIn)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                      v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions?)null)!);

        entity.Property(e => e.CreatedAt)
                  .ValueGeneratedOnAdd()
                  .HasDefaultValueSql("GETUTCDATE()");

        entity.Property(e => e.UpdatedAt)
                  .ValueGeneratedOnAdd()
                  .HasDefaultValueSql("GETUTCDATE()");
      });
    }
  }
}
