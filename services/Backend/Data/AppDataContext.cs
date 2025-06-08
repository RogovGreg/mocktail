using Microsoft.EntityFrameworkCore;
using MyService.Models;

namespace MyService.Data
{
  public class AppDbContext : DbContext
  {
    public DbSet<Template> Templates => Set<Template>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Template>()
          .Property(p => p.Name);
    }
  }
}
