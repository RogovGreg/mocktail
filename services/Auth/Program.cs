using Auth.Data;
using Auth.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Npgsql;
using DotNetEnv;

Env.Load("../../.env");

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("AuthDb");
Console.WriteLine("Auth service. connectionString: ", connectionString);

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'AuthDb' not found. Make sure the environment variable 'ConnectionStrings__AuthDb' is set.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        connectionString
    ));

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not found"))
        )
    };
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtTokenService>();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Npgsql.PostgresException ex) when (ex.SqlState == "42P04")
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

// Routes
app.MapPost("/login", AuthHandlers.LoginHandler);
app.MapPost("/register", AuthHandlers.RegisterHandler);
app.MapPost("/logout", AuthHandlers.LogoutHandler).RequireAuthorization();
app.MapPost("/refresh-token", AuthHandlers.RefreshTokenHandler).AllowAnonymous();
app.MapGet("/profile", AuthHandlers.ProfileHandler).RequireAuthorization();
app.MapPatch("/profile/update", AuthHandlers.ProfileUpdateHandler).RequireAuthorization();
app.MapGet("/check-status", AuthHandlers.CheckStatusHandler).RequireAuthorization();
app.MapGet("/check-availability", AuthHandlers.CheckAvailability).RequireAuthorization();

app.Urls.Add("http://*:80");
app.Run();
