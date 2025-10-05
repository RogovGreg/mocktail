using Microsoft.AspNetCore.Authentication;
using Content.Services;
using Content.Repositories;
using Content.Data;
using Content.Entities;
using Shared.Content.Protos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add gRPC support
builder.Services.AddGrpc();

// Add Entity Framework
var connectionString = builder.Configuration.GetConnectionString("ContentDb");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'ContentDb' not found. Make sure the environment variable 'ConnectionStrings__ContentDb' is set.");
}

builder.Services.AddDbContext<ContentDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register repositories
builder.Services.AddScoped<IGeneratedContentRepository, GeneratedContentRepository>();

// Register HTTP clients for external services
builder.Services.AddHttpClient<IBackendService, BackendService>((serviceProvider, client) =>
{
    var options = serviceProvider.GetRequiredService<IOptions<BackendServiceOptions>>();
    client.BaseAddress = new Uri(options.Value.BaseUrl);
});

// Register gRPC client for Generator service
builder.Services.AddGrpcClient<Generator.Protos.GeneratorService.GeneratorServiceClient>(options =>
{
    options.Address = new Uri("http://generator:8080");
});

// Register service options
builder.Services.Configure<BackendServiceOptions>(builder.Configuration.GetSection("BackendService"));

// Register services
builder.Services.AddScoped<IGeneratorService, GeneratorService>();

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


// Mock API endpoints for serving generated content
app.MapGet("/api/mock/{projectId}/{endpointPath}", async (string projectId, string endpointPath, IGeneratedContentRepository repository) =>
{
    if (!Guid.TryParse(projectId, out var projectGuid))
    {
        return Results.BadRequest("Invalid project ID format");
    }

    var content = await repository.GetByProjectAndPathAsync(projectGuid, endpointPath);
    if (content == null)
    {
        return Results.NotFound($"No content found for project {projectId} and path {endpointPath}");
    }

    // Return the raw JSON data
    return Results.Content(content.GeneratedData, "application/json");
});

// Additional endpoints for content management
app.MapGet("/api/generated/{contentId}", async (string contentId, IGeneratedContentRepository repository) =>
{
    if (!Guid.TryParse(contentId, out var contentGuid))
    {
        return Results.BadRequest("Invalid content ID format");
    }

    var content = await repository.GetByIdAsync(contentGuid);
    if (content == null)
    {
        return Results.NotFound($"Content with ID {contentId} not found");
    }

    return Results.Json(content);
});

app.MapGet("/api/generated", async (string? userId, string? projectId, IGeneratedContentRepository repository) =>
{
    IEnumerable<GeneratedContent> content;
    
    if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
    {
        content = await repository.GetByUserIdAsync(userGuid);
    }
    else if (!string.IsNullOrEmpty(projectId) && Guid.TryParse(projectId, out var projectGuid))
    {
        content = await repository.GetByProjectIdAsync(projectGuid);
    }
    else
    {
        return Results.BadRequest("Either userId or projectId must be provided");
    }

    return Results.Json(content);
});

app.Urls.Add("http://*:80");
app.Urls.Add("http://*:8080");

app.Run();
