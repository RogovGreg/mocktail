using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Content.Data;

/// <summary>
/// Design-time factory for ContentDbContext used by Entity Framework migrations.
/// This factory only configures the DbContext without any application services like Redis.
/// </summary>
public class ContentDbContextFactory : IDesignTimeDbContextFactory<ContentDbContext>
{
    public ContentDbContext CreateDbContext(string[] args)
    {
        // Create configuration from environment variables
        var configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

        // Get connection string
        var connectionString = configuration.GetConnectionString("ContentDb");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'ContentDb' not found. Make sure the environment variable 'ConnectionStrings__ContentDb' is set.");
        }

        // Create DbContext options
        var optionsBuilder = new DbContextOptionsBuilder<ContentDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new ContentDbContext(optionsBuilder.Options);
    }
}
