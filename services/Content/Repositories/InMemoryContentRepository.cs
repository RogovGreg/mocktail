using System.Collections.Concurrent;
using Shared.Content.Protos;

namespace Content.Repositories;

public class InMemoryContentRepository : IContentRepository
{
    private readonly ConcurrentBag<ContentItem> _contentItems = new();

    public InMemoryContentRepository()
    {
        if (_contentItems.IsEmpty)
        {
            _contentItems.Add(new ContentItem
            {
                Id = "1",
                UserId = "1",
                ContentBody = "Hello, world!",
                CreatedAt = DateTime.UtcNow.ToString("o")
            });
        }
    }

    public IEnumerable<ContentItem> GetAll()
    {
        return _contentItems.ToArray();
    }

    public IEnumerable<ContentItem> GetByUserId(string userId)
    {
        return _contentItems.Where(x => x.UserId == userId).ToArray();
    }

    public ContentItem Add(string userId, string contentBody)
    {
        var item = new ContentItem
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            ContentBody = contentBody,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };
        _contentItems.Add(item);
        return item;
    }
}
