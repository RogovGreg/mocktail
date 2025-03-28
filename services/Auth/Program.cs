using Auth.Data;
using Auth.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure database first
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string not found");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure Identity before Authentication and Authorization
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configure Authentication
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
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not found")))
    };
});

// Configure Authorization
builder.Services.AddAuthorization();

// Add other services
builder.Services.AddScoped<JwtTokenService>();

var app = builder.Build();

// // Configure middleware pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// Order matters for middleware
app.UseHttpsRedirection();
app.UseAuthentication(); // Must come before UseAuthorization
app.UseAuthorization();

// Configure endpoints
app.MapPost("/login", async (
    HttpContext context,
    LoginRequest request,
    UserManager<User> userManager,
    JwtTokenService tokenService) =>
{
    var user = await userManager.FindByNameAsync(request.Email);
    if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
    {
        return Results.NotFound();
    }

    var (accessToken, refreshToken, expires) = await tokenService.GenerateTokens(user);
    
    context.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, // true, if we use HTTPS
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(7),
    });

    return Results.Ok(new
    {
        AccessToken = new
        {
            AccessToken = accessToken,
            ExpiresIn = expires,
            TokenType = "Bearer"
        },
        AuthorizedUser = new
        {
            UserName = user.UserName,
            Email = user.Email,
            ID = user.Id
        }
    });
});

app.MapPost("/register", async (
    RegisterRequest request,
    UserManager<User> userManager) =>
{
    var user = new User { UserName = request.Email, Email = request.Email };
    var result = await userManager.CreateAsync(user, request.Password);

    if (!result.Succeeded)
    {
        return Results.BadRequest(result.Errors);
    }

    return Results.Ok();
});

// app.MapPost("/refresh-token", async (
//     HttpContext context,
//     RefreshTokenRequest request,
//     UserManager<User> userManager,
//     JwtTokenService tokenService) =>
// {
//     var user = await userManager.FindByNameAsync(request.Email);
//     if (user == null)
//     {
//         return Results.NotFound();
//     }

//     var refreshToken = context.Request.Cookies["refreshToken"];
//     if (string.IsNullOrEmpty(refreshToken))
//     {
//         return Results.Unauthorized();
//     }

//     if (!await tokenService.ValidateRefreshToken(user, refreshToken))
//     {
//         return Results.Unauthorized();
//     }

//     var (accessToken, newRefreshToken, expires) = await tokenService.GenerateTokens(user);
    
//     return Results.Ok(new
//     {
//         AccessToken = accessToken,
//         RefreshToken = newRefreshToken,
//         TokenType = "Bearer",
//         ExpiresIn = expires
//     });
// });

app.MapPost("/refresh-token", async (
    HttpContext context,
    RefreshTokenRequest request,
    UserManager<User> userManager,
    JwtTokenService tokenService) =>
{
    var user = await userManager.FindByIdAsync(request.UserId);
    if (user == null)
    {
        return Results.NotFound();
    }

    var refreshToken = context.Request.Cookies["refreshToken"];
    if (string.IsNullOrEmpty(refreshToken))
    {
        return Results.Json(new { Message = "`refreshToken` is null or empty" }, statusCode: 401);
    }

    if (!await tokenService.ValidateRefreshToken(user, refreshToken))
    {
        return Results.Json(new { Message = "`refreshToken` is invalid" }, statusCode: 401);
    }

    var (accessToken, newRefreshToken, expires) = await tokenService.GenerateTokens(user);

    context.Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = false, // true, if we use HTTPS
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(7),
    });
    
    return Results.Ok(new
    {
        AccessToken = accessToken,
        TokenType = "Bearer",
        ExpiresIn = expires
    });
}).AllowAnonymous();

app.MapPost("/logout", (HttpContext context) =>
{
    context.Response.Cookies.Delete("refreshToken", new CookieOptions
    {
        HttpOnly = true,
        // Secure = true,
        SameSite = SameSiteMode.Strict
    });

    return Results.Ok(new { Message = "Logged out successfully" });
});

app.MapGet("/profile", async (HttpContext context, UserManager<User> userManager) =>
{
    if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
    {
        return Results.Unauthorized();
    }
    
    var userName = context.User.Identity.Name;
    
    var user = await userManager.FindByNameAsync(userName);
    if (user == null)
    {
        return Results.NotFound();
    }
    
    return Results.Ok(new 
    {
        user.Id,
        user.UserName,
        user.Email,
    });
}).RequireAuthorization();


app.MapGet("/check-status", (HttpContext context) =>
{
    if (context.User?.Identity?.IsAuthenticated == true)
    {
        return Results.Ok();
    }
    return Results.Unauthorized();
}).RequireAuthorization();

// Health check endpoint
app.MapGet("/check-availability", () =>
{
    return Results.Ok(new
    {
        service = "auth-service",
        timestamp = DateTime.UtcNow.ToString("o")
    });
}).RequireAuthorization();

app.Urls.Add("http://*:80");

app.Run();

// Request DTOs
public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
// public record RefreshTokenRequest(string Email);
public record RefreshTokenRequest(string UserId);
