using System.Security.Cryptography;
using System.Text;
using Auth.Data;
using Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace Auth.Services;

public interface IApiTokenService
{
    Task<ApiTokenResult> CreateTokenAsync(string userId, Guid projectId, string name, DateTimeOffset? expiresAt = null);
    Task<ApiTokenValidationResult> ValidateTokenAsync(string token);
    Task<bool> RevokeTokenAsync(string token);
    Task<IEnumerable<ApiToken>> GetUserTokensAsync(string userId);
    Task<IEnumerable<ApiToken>> GetUserTokensByProjectAsync(string userId, Guid projectId);
    Task<bool> DeleteTokenAsync(Guid tokenId, string userId);
}

public record ApiTokenResult(bool Success, string? Token, string? ErrorMessage, Guid? TokenId, DateTimeOffset? CreatedAt);
public record ApiTokenValidationResult(bool IsValid, string? UserId, Guid? ProjectId, string? ErrorMessage);

public class ApiTokenService : IApiTokenService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ApiTokenService> _logger;

    public ApiTokenService(ApplicationDbContext context, ILogger<ApiTokenService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiTokenResult> CreateTokenAsync(string userId, Guid projectId, string name, DateTimeOffset? expiresAt = null)
    {
        try
        {
            // Generate a secure random token
            var tokenBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(tokenBytes);
            var token = Convert.ToBase64String(tokenBytes);

            // Hash the token for storage
            var tokenHash = HashToken(token);

            var apiToken = new ApiToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProjectId = projectId,
                TokenHash = tokenHash,
                Name = name,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = expiresAt,
                IsActive = true
            };

            _context.ApiTokens.Add(apiToken);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created API token {TokenId} for user {UserId} and project {ProjectId}",
                apiToken.Id, userId, projectId);

            return new ApiTokenResult(true, token, null, apiToken.Id, apiToken.CreatedAt);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating API token for user {UserId}", userId);
            return new ApiTokenResult(false, null, "Failed to create API token", null, null);
        }
    }

    public async Task<ApiTokenValidationResult> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHash = HashToken(token);

            var apiToken = await _context.ApiTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && t.IsActive);

            if (apiToken == null)
            {
                return new ApiTokenValidationResult(false, null, null, "Invalid token");
            }

            if (apiToken.ExpiresAt.HasValue && apiToken.ExpiresAt.Value < DateTimeOffset.UtcNow)
            {
                return new ApiTokenValidationResult(false, null, null, "Token has expired");
            }

            return new ApiTokenValidationResult(true, apiToken.UserId, apiToken.ProjectId, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating API token");
            return new ApiTokenValidationResult(false, null, null, "Token validation failed");
        }
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
        try
        {
            var tokenHash = HashToken(token);

            var apiToken = await _context.ApiTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

            if (apiToken == null)
            {
                return false;
            }

            apiToken.IsActive = false;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Revoked API token {TokenId}", apiToken.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking API token");
            return false;
        }
    }

    public async Task<IEnumerable<ApiToken>> GetUserTokensAsync(string userId)
    {
        return await _context.ApiTokens
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ApiToken>> GetUserTokensByProjectAsync(string userId, Guid projectId)
    {
        return await _context.ApiTokens
            .Where(t => t.UserId == userId && t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteTokenAsync(Guid tokenId, string userId)
    {
        try
        {
            var apiToken = await _context.ApiTokens
                .FirstOrDefaultAsync(t => t.Id == tokenId && t.UserId == userId);

            if (apiToken == null)
            {
                return false;
            }

            _context.ApiTokens.Remove(apiToken);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted API token {TokenId} for user {UserId}", tokenId, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting API token {TokenId} for user {UserId}", tokenId, userId);
            return false;
        }
    }

    private static string HashToken(string token)
    {
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(hashBytes);
    }
}
