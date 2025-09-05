using Microsoft.AspNetCore.Authentication;
using Content.Services;
using Content.Repositories;
using Shared.Content.Protos;
using Content;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add gRPC support
builder.Services.AddGrpc();

// Register repository as a singleton so gRPC and HTTP share data
builder.Services.AddSingleton<IContentRepository, InMemoryContentRepository>();

// Configure Kestrel specifically for gRPC
builder.WebHost.ConfigureKestrel(options =>
{
    // Setup a HTTP/2 endpoint without TLS for gRPC
    options.ListenAnyIP(8080, o => o.Protocols =
        Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http2);

    // Setup a HTTP/1.1 endpoint for REST API
    options.ListenAnyIP(80, o => o.Protocols =
        Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Map gRPC service
app.MapGrpcService<ContentServiceImpl>();

app.MapGet("/", () => "`Content` service is alive");

app.MapGet("/check-availability", () =>
{
    return Results.Json(new
    {
        service = "Content",
        timestamp = DateTime.UtcNow.ToString("o")
    });
});

// REST API endpoint to list content with optional userId filter
app.MapGet("/api/content", (string? userId, IContentRepository repository) =>
{
    var items = string.IsNullOrEmpty(userId) ? repository.GetAll() : repository.GetByUserId(userId);
    return Results.Json(items);
});

app.MapPost("/api/content/template/{id:guid}/generate", ContentHandlers.HandleGenerateFromTemplate);

app.Urls.Add("http://*:80");
app.Urls.Add("http://*:8080");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
