using Shared.Content.Protos;
using Grpc.Core;

namespace Content.Services;

public class ContentServiceImpl : Shared.Content.Protos.ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly List<ContentItem> _contentItems = new(); // In-memory storage for demo

    public ContentServiceImpl(ILogger<ContentServiceImpl> logger)
    {
        _logger = logger;
    }

    public override Task<ListContentResponse> ListContent(ListContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Listing content for user: {UserId}", request.UserId);

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

        return Task.FromResult(new CreateContentResponse
        {
            Item = newItem
        });
    }
}
