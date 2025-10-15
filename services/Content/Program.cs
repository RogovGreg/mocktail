using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Content.Services;
using Content.Repositories;
using Content.Data;
using Content.Entities;
using Content.Workers;
using Shared.Content.Protos;
using StackExchange.Redis;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add gRPC support
builder.Services.AddGrpc();

// No authentication needed - Gateway handles it and forwards headers

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

// Register Redis caching
var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
if (string.IsNullOrWhiteSpace(redisConnectionString))
{
    throw new InvalidOperationException("Connection string 'Redis' not found. Make sure the environment variable 'ConnectionStrings__Redis' is set.");
}

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
});

// Register Redis connection for advanced operations
builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
{
    return ConnectionMultiplexer.Connect(redisConnectionString);
});

// Register cache service
builder.Services.AddScoped<ICacheService, RedisCacheService>();

// Register gRPC client for Generator service
builder.Services.AddGrpcClient<Generator.Protos.GeneratorService.GeneratorServiceClient>(options =>
{
    options.Address = new Uri("http://generator:8080");
});

// Register services
builder.Services.AddScoped<IGeneratorService, GeneratorService>();

// Register RabbitMQ services
var rabbitMqConnectionString = builder.Configuration.GetConnectionString("RabbitMQ");
if (string.IsNullOrWhiteSpace(rabbitMqConnectionString))
{
    throw new InvalidOperationException("Connection string 'RabbitMQ' not found. Make sure the environment variable 'ConnectionStrings__RabbitMQ' is set.");
}

builder.Services.AddSingleton<IConnection>(provider =>
{
    var factory = new ConnectionFactory
    {
        Uri = new Uri(rabbitMqConnectionString),
        AutomaticRecoveryEnabled = true,
        NetworkRecoveryInterval = TimeSpan.FromSeconds(10)
    };
    return factory.CreateConnection();
});

builder.Services.AddSingleton<IRabbitMqPublisher, RabbitMqPublisher>();

// Register background worker
builder.Services.AddHostedService<ContentGenerationWorker>();

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
app.MapGet("/api/mock/{projectId}/{*endpointPath}", 
    async Task<IResult> (string projectId, string endpointPath, 
IGeneratedContentRepository repository,
ICacheService cacheService,
ILogger<Program> logger,
           HttpContext context) =>
{
    // Get project ID from forwarded header (Gateway forwards claims as headers)
    var tokenProjectId = context.Request.Headers["X-Project-Id"].FirstOrDefault();
    
    // Validate authorization - ensure token is authorized for the requested project (guid-safe)
    if (string.IsNullOrEmpty(tokenProjectId))
    {
        return Results.Problem("Token not authorized for this project", statusCode: 403);
    }

    if (!Guid.TryParse(projectId, out var projectGuid))
    {
        return Results.BadRequest("Invalid project ID format");
    }

    if (!Guid.TryParse(tokenProjectId, out var tokenProjectGuid) || tokenProjectGuid != projectGuid)
    {
        return Results.Problem("Token not authorized for this project", statusCode: 403);
    }

    // Try to get content from cache first
    var cachedContent = await cacheService.GetCachedContentAsync(projectGuid, endpointPath);
    if (cachedContent != null)
    {
        return Results.Content(cachedContent.GeneratedData, "application/json");
    }

    // Cache miss - get from database
    var allContent = await repository.GetByProjectIdAsync(projectGuid);
    var content = allContent
        .Where(c => c.EndpointPath == endpointPath)
        .OrderByDescending(c => c.CreatedAt)
        .FirstOrDefault();
    
    if (content == null)
    {
        logger.LogWarning("No content found in database for project {ProjectId} and path {EndpointPath}", projectGuid, endpointPath);
        return Results.NotFound($"No content found for project {projectId} and path {endpointPath}");
    }

    await cacheService.SetCachedContentAsync(projectGuid, endpointPath, content);

    // Return the raw JSON data
    return Results.Content(content.GeneratedData, "application/json");
});


app.Urls.Add("http://*:80");
app.Urls.Add("http://*:8080");

app.Run();
