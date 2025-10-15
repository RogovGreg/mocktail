using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Generator.Data;

public class GeneratorDbContextFactory : IDesignTimeDbContextFactory<GeneratorDbContext>
{
    public GeneratorDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<GeneratorDbContext>();

        var conn = Environment.GetEnvironmentVariable("ConnectionStrings__GeneratorDb");

        if (string.IsNullOrWhiteSpace(conn))
        {
            throw new InvalidOperationException("ConnectionStrings__GeneratorDb environment variable is not set.");
        }

        optionsBuilder.UseNpgsql(conn);
        return new GeneratorDbContext(optionsBuilder.Options);
    }
}
