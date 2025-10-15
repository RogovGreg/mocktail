using Microsoft.EntityFrameworkCore;
using Generator.Entities;

namespace Generator.Data;

public class GeneratorDbContext : DbContext
{
    public GeneratorDbContext(DbContextOptions<GeneratorDbContext> options) : base(options)
    {
    }

    public DbSet<ProjectConfig> ProjectConfigs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProjectConfig>(entity =>
        {
            entity.HasIndex(e => e.ProjectId).IsUnique();
            entity.Property(e => e.OpenAiKey).HasMaxLength(200);
            entity.Property(e => e.Model).HasMaxLength(100);
        });
    }
}
