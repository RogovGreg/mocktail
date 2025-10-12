using Content.Entities;

namespace Content.Services;

public interface ICacheService
{
    Task<GeneratedContent?> GetCachedContentAsync(Guid projectId, string endpointPath);
    Task SetCachedContentAsync(Guid projectId, string endpointPath, GeneratedContent content, TimeSpan? expiration = null);
    Task InvalidateProjectCacheAsync(Guid projectId);
    Task InvalidateContentCacheAsync(Guid projectId, string endpointPath);
}
