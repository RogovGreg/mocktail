using Shared.Content.Protos;
using Microsoft.EntityFrameworkCore;
using Grpc.Net.Client;
using Microsoft.Extensions.DependencyInjection;
using MyService.Data;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpcClient<ContentService.ContentServiceClient>(options =>
{
    options.Address = new Uri("http://content:8080");
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801)
    {
        Console.WriteLine("Database already exists, skipping CREATE DATABASE.");
        var pending = db.Database.GetPendingMigrations();
        if (pending.Any())
        {
            Console.WriteLine($"Applying {pending.Count()} pending migrations...");
            db.Database.Migrate();
        }
    }
}

// Middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/templates", BackendHandlers.GetTemplates);
app.MapGet("/templates/{id:guid}", BackendHandlers.GetTemplateById);
app.MapPost("/templates", BackendHandlers.CreateTemplate);
app.MapPut("/templates/{id:guid}", BackendHandlers.UpdateTemplate);
app.MapDelete("/templates/{id:guid}", BackendHandlers.DeleteTemplate);

app.MapGet("/check-availability", () =>
{
    return Results.Json(new
    {
        service = "Backend",
        timestamp = DateTime.UtcNow.ToString("o")
    });
});

app.MapGet("/content/{userId}", ContentHandlers.GetContent);
app.MapPost("/content", ContentHandlers.CreateContent);

app.MapGet("/", () => "`Backend` service is alive");

app.Urls.Add("http://*:80");

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
