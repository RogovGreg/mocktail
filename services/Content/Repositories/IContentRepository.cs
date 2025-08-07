using Shared.Content.Protos;

namespace Content.Repositories;

public interface IContentRepository
{
    IEnumerable<ContentItem> GetAll();
    IEnumerable<ContentItem> GetByUserId(string userId);
    ContentItem Add(string userId, string contentBody);
}