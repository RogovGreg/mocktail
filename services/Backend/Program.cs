using Microsoft.EntityFrameworkCore;
using Grpc.Net.Client;
using Microsoft.Extensions.DependencyInjection;
using MyService.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http.Json;
using Backend.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://auth";
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
builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("BackendDb");
Console.WriteLine($"Backend service. connectionString: {connectionString}");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'BackendDb' not found. Make sure the environment variable 'ConnectionStrings__BackendDb' is set.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
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

app.MapGet("/", () => "`Backend` service is alive");

app.Urls.Add("http://*:80");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
