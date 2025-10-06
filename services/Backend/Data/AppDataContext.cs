using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Backend.Utils;
using MyService.Models;
using System.Security.Claims;

namespace MyService.Data
{
  public class AppDbContext : DbContext
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AppDbContext(
      DbContextOptions<AppDbContext> options,
      IHttpContextAccessor httpContextAccessor
    ) : base(options)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public DbSet<Project> Projects { get; set; } = null!;

    public DbSet<Template> Templates { get; set; } = null!;

    public async Task<int> SaveProjectChangesAsync(CancellationToken ct = default)
    {
      var now = DateTimeOffset.UtcNow.UtcDateTruncateToMilliseconds();

      Guid? currentUserId = null;
      var user = _httpContextAccessor.HttpContext?.User;

      string? idStr = user?.FindFirst("sub")?.Value ?? user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (idStr is not null && Guid.TryParse(idStr, out var parsed))
        currentUserId = parsed;

      foreach (var entry in ChangeTracker.Entries<Project>())
      {
        switch (entry.State)
        {
          case EntityState.Added:
            entry.Entity.CreatedAt = now;
            entry.Entity.UpdatedAt = now;

            if (currentUserId is Guid uid)
            {
              entry.Entity.CreatedBy = uid;
              entry.Entity.UpdatedBy = uid;
            }

            break;

          case EntityState.Modified:
            entry.Property(p => p.CreatedAt).IsModified = false;
            entry.Property(p => p.CreatedBy).IsModified = false;

            entry.Entity.UpdatedAt = now;

            if (currentUserId is Guid uid2)
              entry.Entity.UpdatedBy = uid2;

            break;
        }
      }
      return await base.SaveChangesAsync(ct);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
      var now = DateTimeOffset.UtcNow.UtcDateTruncateToMilliseconds();

      Guid? currentUserId = null;
      var user = _httpContextAccessor.HttpContext?.User;

      string? idStr = user?.FindFirst("sub")?.Value ?? user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      if (idStr is not null && Guid.TryParse(idStr, out var parsed))
        currentUserId = parsed;

      foreach (var entry in ChangeTracker.Entries<Template>())
      {
        switch (entry.State)
        {
          case EntityState.Added:
            entry.Entity.CreatedAt = now;
            entry.Entity.UpdatedAt = now;

            if (currentUserId is Guid uid)
            {
              entry.Entity.CreatedBy = uid;
              entry.Entity.UpdatedBy = uid;
            }

            break;

          case EntityState.Modified:
            entry.Property(p => p.CreatedAt).IsModified = false;
            entry.Property(p => p.CreatedBy).IsModified = false;

            entry.Entity.UpdatedAt = now;

            if (currentUserId is Guid uid2)
              entry.Entity.UpdatedBy = uid2;

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
