using Grpc.Core;
using Shared.Content.Protos;
using Content.Repositories;

namespace Content.Services;

public class ContentServiceImpl : ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly IContentRepository _repository;

    public ContentServiceImpl(ILogger<ContentServiceImpl> logger, IContentRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    public override Task<GenerateResponse> GenerateFromTemplate(GenerateRequest request, ServerCallContext context)
    {
        var response = new GenerateResponse
        {
            Message = $"Request received by gRPC to generate content using template {request.TemplateId} with the provided Schema and Path",
            TemplateId = request.TemplateId,
            Schema = request.Schema,
            Path = request.Path
        };

        return Task.FromResult(response);
    }

    public override Task<ListContentResponse> ListContent(ListContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Listing content for user: {UserId}", request.UserId);
        var items = string.IsNullOrEmpty(request.UserId)
            ? _repository.GetAll()
            : _repository.GetByUserId(request.UserId);

        return Task.FromResult(new ListContentResponse
        {
            Items = { items }
        });
    }

    public override Task<CreateContentResponse> CreateContent(CreateContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Creating content for user: {UserId}", request.UserId);

        var newItem = _repository.Add(request.UserId, request.ContentBody);
        _logger.LogInformation("Added new content item with ID: {Id} and content: {Content}", newItem.Id, newItem.ContentBody);

        return Task.FromResult(new CreateContentResponse
        {
            Item = newItem
        });
    }
}
