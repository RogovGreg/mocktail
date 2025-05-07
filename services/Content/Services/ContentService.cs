using Shared.Content.Protos;
using Grpc.Core;

namespace Content.Services;

public class ContentServiceImpl : Shared.Content.Protos.ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private static readonly List<ContentItem> _contentItems = new(); // Static storage for demo

    public ContentServiceImpl(ILogger<ContentServiceImpl> logger)
    {
        _logger = logger;
        if (_contentItems.Count == 0)
        {
            _contentItems.Add(new ContentItem { Id = "1", UserId = "1", ContentBody = "Hello, world!", CreatedAt = DateTime.UtcNow.ToString("o") });
        }
    }

    public override Task<ListContentResponse> ListContent(ListContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Listing content for user: {UserId}", request.UserId);
        _logger.LogInformation("Current content items: {ContentItems}", _contentItems);
        var items = string.IsNullOrEmpty(request.UserId)
            ? _contentItems
            : _contentItems.Where(x => x.UserId == request.UserId).ToList();

        return Task.FromResult(new ListContentResponse
        {
            Items = { items }
        });
    }

    public override Task<CreateContentResponse> CreateContent(CreateContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Creating content for user: {UserId}", request.UserId);

        var newItem = new ContentItem
        {
            Id = Guid.NewGuid().ToString(),
            UserId = request.UserId,
            ContentBody = request.ContentBody,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        _contentItems.Add(newItem);
        _logger.LogInformation("Added new content item with ID: {Id} and content: {Content}", newItem.Id, newItem.ContentBody);

        return Task.FromResult(new CreateContentResponse
        {
            Item = newItem
        });
    }
}
