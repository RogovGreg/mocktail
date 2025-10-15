using Microsoft.EntityFrameworkCore;
using MyService.Data;
using Npgsql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http.Json;
using Backend.Serialization;
using Shared.Content.Protos;
using Microsoft.Extensions.DependencyInjection;
using Grpc.Net.Client;
using Grpc.Net.ClientFactory;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add gRPC client for Content service
builder.Services.AddGrpcClient<ContentService.ContentServiceClient>(options =>
{
    options.Address = new Uri("http://content:8080");
});

// Add gRPC client for Generator service
builder.Services.AddGrpcClient<Generator.Protos.GeneratorService.GeneratorServiceClient>(options =>
{
    options.Address = new Uri("http://generator:8080");
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]
                    ?? throw new InvalidOperationException("JWT Secret not found"))
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

var connectionString = builder.Configuration.GetConnectionString("BackendDb");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'BackendDb' not found. Make sure the environment variable 'ConnectionStrings__BackendDb' is set.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString
    ));


builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new UtcMillisecondsConverter());
});

var app = builder.Build();
// Middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/projects", BackendHandlers.GetProjects);
app.MapGet("/projects/{id:guid}", BackendHandlers.GetProjectById);
app.MapPost("/projects", BackendHandlers.CreateProject);
app.MapPut("/projects/{id:guid}", BackendHandlers.UpdateProject);
app.MapDelete("/projects/{id:guid}", BackendHandlers.DeleteProject);
// Project config via GRPC
app.MapGet("/projects/{id:guid}/config", BackendHandlers.GetProjectConfig);
app.MapPut("/projects/{id:guid}/config", BackendHandlers.SetProjectConfig);

app.MapGet("/templates", BackendHandlers.GetTemplates);
app.MapGet("/templates/{id:guid}", BackendHandlers.GetTemplateById);
app.MapPost("/templates", BackendHandlers.CreateTemplate);
app.MapPut("/templates/{id:guid}", BackendHandlers.UpdateTemplate);
app.MapDelete("/templates/{id:guid}", BackendHandlers.DeleteTemplate);
app.MapPost("/templates/{id:guid}/generate", BackendHandlers.GenerateTemplateData).RequireAuthorization();

app.MapGet("/check-availability", () =>
{
    return Results.Json(new
    {
        service = "Backend",
        timestamp = DateTime.UtcNow.ToString("o")
    });
});

app.MapGet("/", () => "`Backend` service is alive");

app.Urls.Add("http://*:80");

app.Run();
