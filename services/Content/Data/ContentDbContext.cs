using Microsoft.EntityFrameworkCore;
using Content.Entities;

namespace Content.Data;

public class ContentDbContext : DbContext
{
    public ContentDbContext(DbContextOptions<ContentDbContext> options) : base(options)
    {
    }

    public DbSet<GeneratedContent> GeneratedContent { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure GeneratedContent entity
        modelBuilder.Entity<GeneratedContent>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.GeneratedData)
                .HasColumnType("jsonb");
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");
            
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("NOW()");
            
            entity.Property(e => e.Status)
                .HasDefaultValue("Completed")
                .HasMaxLength(20);
            
            entity.Property(e => e.EndpointPath)
                .HasMaxLength(500);

            // Create index for project + endpoint combination (not unique to allow multiple versions)
            entity.HasIndex(e => new { e.ProjectId, e.EndpointPath })
                .HasDatabaseName("IX_GeneratedContent_ProjectId_EndpointPath");

            // Create indexes for performance
            entity.HasIndex(e => e.TemplateId)
                .HasDatabaseName("IX_GeneratedContent_TemplateId");
            
            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("IX_GeneratedContent_UserId");
            
            entity.HasIndex(e => e.CreatedAt)
                .HasDatabaseName("IX_GeneratedContent_CreatedAt");
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update UpdatedAt for all modified entities
        foreach (var entry in ChangeTracker.Entries<GeneratedContent>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
