using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Gateway.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add configuration files - only ocelot.json and environment variables
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add HTTP client for API token validation
builder.Services.AddHttpClient("AuthService", client =>
{
    client.BaseAddress = new Uri("http://auth:80");
});

// Add services to the container
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudiences = new[] { 
                builder.Configuration["Jwt:Issuer"], 
                builder.Configuration["Jwt:Audience"]
            },
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not found")))
        };
    })
    .AddScheme<ApiTokenAuthenticationSchemeOptions, ApiTokenAuthenticationHandler>("ContentBearer", options => { });

// This line was missing and caused the error
builder.Services.AddAuthorization();

// Add Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// TODO: Remove this in production
app.UseDeveloperExceptionPage();

// Use authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
