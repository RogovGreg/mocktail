using Auth.Entities;
using Microsoft.AspNetCore.Identity;

public static class AuthHandlers
{
    public static async Task<IResult> LoginHandler(
        LoginRequest request,
        UserManager<User> userManager,
        JwtTokenService tokenService)
    {
        var user = await userManager.FindByNameAsync(request.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Results.NotFound();
        }

        var (accessToken, refreshToken, expires) = await tokenService.GenerateTokens(user);

        return Results.Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            TokenType = "Bearer",
            ExpiresIn = expires,
        });
    }

    public static async Task<IResult> RegisterHandler(
        RegisterRequest request,
        UserManager<User> userManager)
    {
        var user = new User { UserName = request.Email, Email = request.Email };
        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return Results.BadRequest(result.Errors);
        }

        return Results.Ok();
    }

    public static async Task<IResult> RefreshTokenHandler(
        RefreshTokenRequest request,
        UserManager<User> userManager,
        JwtTokenService tokenService)
    {
        var user = await userManager.FindByNameAsync(request.Email);
        if (user == null)
        {
            return Results.NotFound();
        }

        if (!await tokenService.ValidateRefreshToken(user, request.RefreshToken))
        {
            return Results.Unauthorized();
        }

        var (accessToken, refreshToken, expires) = await tokenService.GenerateTokens(user);

        return Results.Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            TokenType = "Bearer",
            ExpiresIn = expires,
        });
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record RefreshTokenRequest(string Email, string RefreshToken);
