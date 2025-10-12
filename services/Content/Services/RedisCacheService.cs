using System.Text.Json;
using Content.Entities;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace Content.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly TimeSpan _defaultExpiration = TimeSpan.FromHours(24); // Cache for 24 hours by default

    public RedisCacheService(IDistributedCache cache, IConnectionMultiplexer redis, ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _redis = redis;
        _logger = logger;
    }

    public async Task<GeneratedContent?> GetCachedContentAsync(Guid projectId, string endpointPath)
    {
        try
        {
            var cacheKey = GetCacheKey(projectId, endpointPath);
            var cachedData = await _cache.GetStringAsync(cacheKey);
            
            if (string.IsNullOrEmpty(cachedData))
            {
                _logger.LogInformation("Cache MISS for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
                return null;
            }

            _logger.LogInformation("Cache HIT for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
            return JsonSerializer.Deserialize<GeneratedContent>(cachedData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cached content for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
            return null; // Return null on cache errors to fall back to database
        }
    }

    public async Task SetCachedContentAsync(Guid projectId, string endpointPath, GeneratedContent content, TimeSpan? expiration = null)
    {
        try
        {
            var cacheKey = GetCacheKey(projectId, endpointPath);
            var serializedContent = JsonSerializer.Serialize(content);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? _defaultExpiration
            };

            await _cache.SetStringAsync(cacheKey, serializedContent, options);
            _logger.LogInformation("Cached content for project {ProjectId} and path {EndpointPath} (expires in {Expiration})", 
                projectId, endpointPath, expiration ?? _defaultExpiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error caching content for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
            // Don't throw - caching failures shouldn't break the application
        }
    }

    public async Task InvalidateProjectCacheAsync(Guid projectId)
    {
        try
        {
            _logger.LogInformation("Invalidating cache for project {ProjectId}", projectId);
            
            // Get all cache keys for this project using Redis pattern matching
            var pattern = GetCacheKeyPattern(projectId);
            var keys = await GetAllKeysAsync(pattern);
            
            if (keys.Any())
            {
                // Remove each key individually since RemoveAsync only accepts a single key
                foreach (var key in keys)
                {
                    await _cache.RemoveAsync(key);
                }
                _logger.LogInformation("Invalidated {Count} cache entries for project {ProjectId}", keys.Count(), projectId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache for project {ProjectId}", projectId);
        }
    }

    public async Task InvalidateContentCacheAsync(Guid projectId, string endpointPath)
    {
        try
        {
            var cacheKey = GetCacheKey(projectId, endpointPath);
            await _cache.RemoveAsync(cacheKey);
            _logger.LogInformation("Invalidated cache for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invalidating cache for project {ProjectId} and path {EndpointPath}", projectId, endpointPath);
        }
    }

    private static string GetCacheKey(Guid projectId, string endpointPath)
    {
        return $"mock_content:{projectId}:{endpointPath}";
    }

    private static string GetCacheKeyPattern(Guid projectId)
    {
        return $"mock_content:{projectId}:*";
    }

    private async Task<IEnumerable<string>> GetAllKeysAsync(string pattern)
    {
        try
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: pattern);
            return await Task.FromResult(keys.Select(k => k.ToString()));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not retrieve Redis keys for pattern {Pattern}", pattern);
            return Enumerable.Empty<string>();
        }
    }
}
