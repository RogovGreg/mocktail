using Auth.Entities;
using Auth.Services;
using Microsoft.AspNetCore.Identity;
using MyService.Entities;
using System.Security.Claims;

public static class AuthHandlers
{
    public record UpdateProfileRequest(
        string? FirstName,
        string? LastName,
        byte[]? Avatar,
        string? About
    );

    private static CookieOptions CreateRefreshCookieOptions(bool forDelete = false)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(forDelete ? -1 : 7),
        };
    }

    public static async Task<IResult> LoginHandler(
        HttpContext context,
        LoginRequest request,
        UserManager<User> userManager,
        JwtTokenService tokenService
    )
    {
        var user = await userManager.FindByNameAsync(request.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Results.NotFound();
        }

        var (accessToken, refreshToken, expires) = await tokenService.GenerateTokens(user);

        context.Response.Cookies.Append("refreshToken", refreshToken, CreateRefreshCookieOptions());

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
        }
        );
    }

    public static async Task<IResult> RegisterHandler(
        RegisterRequest request,
        UserManager<User> userManager
    )
    {
        var user = new User { UserName = request.Email, Email = request.Email };
        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return Results.BadRequest(result.Errors);
        }

        return Results.Ok();
    }

    public static async Task<IResult> LogoutHandler(
        HttpContext context,
        UserManager<User> userManager,
        JwtTokenService tokenService
    )
    {
        var user = await userManager.GetUserAsync(context.User);
        if (user == null)
        {
            return Results.NotFound();
        }

        await tokenService.DeleteTokens(user);
        context.Response.Cookies.Delete("refreshToken", CreateRefreshCookieOptions(true));

        return Results.Ok(new { Message = "Logged out successfully" });
    }

    public static async Task<IResult> RefreshTokenHandler(
        HttpContext context,
        RefreshTokenRequest request,
        UserManager<User> userManager,
        JwtTokenService tokenService)
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

        if (!tokenService.ValidateRefreshToken(user, refreshToken))
        {
            return Results.Json(new { Message = "`refreshToken` is invalid" }, statusCode: 401);
        }

        var (accessToken, newRefreshToken, expires) = await tokenService.GenerateTokens(user);

        context.Response.Cookies.Append("refreshToken", newRefreshToken, CreateRefreshCookieOptions());

        return Results.Ok(new
        {
            AccessToken = accessToken,
            TokenType = "Bearer",
            ExpiresIn = expires
        });
    }

    public static async Task<IResult> ProfileHandler(
        HttpContext context, UserManager<User> userManager
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
        {
            return Results.Unauthorized();
        }

        var userName = context.User.Identity.Name;
        if (userName == null)
        {
            return Results.NotFound();
        }

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
    }

    public static async Task<IResult> ProfileUpdateHandler(
        HttpContext context,
        UpdateProfileRequest request,
        UserManager<User> userManager
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userName = context.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
            return Results.Unauthorized();
            
        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Results.NotFound();

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Avatar = request.Avatar ?? user.Avatar;
        user.About = request.About ?? user.About;

        await userManager.UpdateAsync(user);

        return Results.Ok(new { Message = "Profile updated successfully" });
    }

    public static async Task<IResult> AddBookmarkHandler(
    HttpContext context,
    Bookmark bookmark,
    UserManager<User> userManager
)
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userName = context.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
            return Results.Unauthorized();
            
        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Results.NotFound();

        user.Bookmarks.Add(bookmark);
        await userManager.UpdateAsync(user);
        return Results.Ok(new { Message = "Bookmark added" });
    }

    public static async Task<IResult> RemoveBookmarkHandler(
        HttpContext context,
        Guid bookmarkId,
        UserManager<User> userManager
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userName = context.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
            return Results.Unauthorized();
            
        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Results.NotFound();

        var bookmark = user.Bookmarks.FirstOrDefault(b => b.Id == bookmarkId);
        if (bookmark == null)
            return Results.NotFound();

        user.Bookmarks.Remove(bookmark);
        await userManager.UpdateAsync(user);

        return Results.Ok(new { Message = "Bookmark removed" });
    }

    public static async Task<IResult> AttachProjectToUserHandler(
        HttpContext context,
        Guid projectId,
        UserManager<User> userManager
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userName = context.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
            return Results.Unauthorized();
            
        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Results.NotFound();

        if (!user.Projects.Contains(projectId))
        {
            user.Projects.Add(projectId);
            await userManager.UpdateAsync(user);
        }
        return Results.Ok(new { Message = "Project attached" });
    }

    public static async Task<IResult> DetachProjectFromUserHandler(
        HttpContext context,
        Guid projectId,
        UserManager<User> userManager
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userName = context.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
            return Results.Unauthorized();
            
        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Results.NotFound();

        if (user.Projects.Contains(projectId))
        {
            user.Projects.Remove(projectId);
            await userManager.UpdateAsync(user);
        }
        return Results.Ok(new { Message = "Project detached" });
    }

    public static IResult CheckStatusHandler(HttpContext context)
    {
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            return Results.Ok();
        }

        return Results.Unauthorized();
    }

    public static IResult CheckAvailability()
    {
        return Results.Ok(new
        {
            service = "auth-service",
            timestamp = DateTime.UtcNow.ToString("o")
        });
    }

    // API Token handlers
    public static async Task<IResult> CreateApiTokenHandler(
        HttpContext context,
        CreateApiTokenRequest request,
        IApiTokenService apiTokenService
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Results.Unauthorized();

        var result = await apiTokenService.CreateTokenAsync(
            userId, 
            request.ProjectId, 
            request.Name, 
            request.ExpiresAt);

        if (!result.Success)
        {
            return Results.BadRequest(new { Message = result.ErrorMessage });
        }

        return Results.Ok(new
        {
            Token = result.Token,
            TokenId = result.TokenId,
            Name = request.Name,
            ProjectId = request.ProjectId,
            ExpiresAt = request.ExpiresAt
        });
    }

    public static async Task<IResult> GetApiTokensHandler(
        HttpContext context,
        IApiTokenService apiTokenService,
        Guid? projectId = null
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Results.Unauthorized();

        IEnumerable<ApiToken> tokens;
        
        if (projectId.HasValue)
        {
            tokens = await apiTokenService.GetUserTokensByProjectAsync(userId, projectId.Value);
        }
        else
        {
            tokens = await apiTokenService.GetUserTokensAsync(userId);
        }
        
        return Results.Ok(tokens.Select(t => new
        {
            t.Id,
            t.Name,
            t.ProjectId,
            t.CreatedAt,
            t.ExpiresAt,
            t.IsActive
        }));
    }

    public static async Task<IResult> DeleteApiTokenHandler(
        HttpContext context,
        Guid tokenId,
        IApiTokenService apiTokenService
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Results.Unauthorized();

        var success = await apiTokenService.DeleteTokenAsync(tokenId, userId);
        if (!success)
        {
            return Results.NotFound();
        }

        return Results.Ok(new { Message = "API token deleted successfully" });
    }

    public static async Task<IResult> RevokeApiTokenHandler(
        HttpContext context,
        RevokeApiTokenRequest request,
        IApiTokenService apiTokenService
    )
    {
        if (context.User?.Identity == null || !context.User.Identity.IsAuthenticated)
            return Results.Unauthorized();

        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Results.Unauthorized();

        var success = await apiTokenService.RevokeTokenAsync(request.Token);
        if (!success)
        {
            return Results.NotFound();
        }

        return Results.Ok(new { Message = "API token revoked successfully" });
    }

    public static async Task<IResult> ValidateApiTokenHandler(
        HttpContext context,
        IApiTokenService apiTokenService
    )
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Results.Unauthorized();
        }

        var token = authHeader.Substring("Bearer ".Length);
        var result = await apiTokenService.ValidateTokenAsync(token);

        if (!result.IsValid)
        {
            return Results.Unauthorized();
        }

        return Results.Ok(new
        {
            IsValid = true,
            UserId = result.UserId,
            ProjectId = result.ProjectId
        });
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record RefreshTokenRequest(string UserId);
public record CreateApiTokenRequest(Guid ProjectId, string Name, DateTimeOffset? ExpiresAt = null);
public record RevokeApiTokenRequest(string Token);
