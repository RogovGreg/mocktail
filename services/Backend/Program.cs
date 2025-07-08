using Shared.Content.Protos;
using Microsoft.EntityFrameworkCore;
using Grpc.Net.Client;
using Microsoft.Extensions.DependencyInjection;
using MyService.Data;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpcClient<ContentService.ContentServiceClient>(options =>
{
    options.Address = new Uri("http://content:8080");
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddNewtonsoftJson(opts =>
    {
        opts.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
        opts.SerializerSettings.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffff'Z'";
    }); ;

var app = builder.Build();

var cs = builder.Configuration.GetConnectionString("DefaultConnection")!;
for (var i = 0; i < 10; i++)
{
    try
    {
        using var testConn = new SqlConnection(cs);
        testConn.Open();
        Console.WriteLine("✅ MSSQL is up");
        break;
    }
    catch
    {
        Console.WriteLine("⏳ MSSQL not ready yet, retrying in 5s...");
        Thread.Sleep(5000);
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
