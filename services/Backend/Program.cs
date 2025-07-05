using Shared.Content.Protos;
using Microsoft.EntityFrameworkCore;
using Grpc.Net.Client;
using Microsoft.Extensions.DependencyInjection;
using MyService.Data;

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
    db.Database.Migrate();
}

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
