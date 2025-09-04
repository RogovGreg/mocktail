using Auth.Entities;
using Microsoft.AspNetCore.Identity;
using MyService.Entities;

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
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record RefreshTokenRequest(string UserId);
