using Grpc.Core;
using Shared.Content.Protos;
using Content.Repositories;
using Content.Entities;

namespace Content.Services;

public class ContentServiceImpl : ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly IContentRepository _repository;
    private readonly IGeneratedContentRepository _generatedContentRepository;
    private readonly IBackendService _backendService;
    private readonly IGeneratorService _generatorService;

    public ContentServiceImpl(
        ILogger<ContentServiceImpl> logger, 
        IContentRepository repository,
        IGeneratedContentRepository generatedContentRepository,
        IBackendService backendService,
        IGeneratorService generatorService)
    {
        _logger = logger;
        _repository = repository;
        _generatedContentRepository = generatedContentRepository;
        _backendService = backendService;
        _generatorService = generatorService;
    }

    public override async Task<GenerateFromTemplateResponse> GenerateFromTemplate(GenerateFromTemplateRequest request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Starting content generation for template {TemplateId}, user {UserId}", 
                request.TemplateId, request.UserId);

            // Validate input
            if (!Guid.TryParse(request.TemplateId, out var templateId))
            {
                return new GenerateFromTemplateResponse
                {
                    Status = "Failed",
                    Message = "Invalid template ID format",
                    TemplateId = request.TemplateId
                };
            }

            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return new GenerateFromTemplateResponse
                {
                    Status = "Failed",
                    Message = "Invalid user ID format",
                    TemplateId = request.TemplateId
                };
            }

            // Fetch template from Backend service
            var template = await _backendService.GetTemplateAsync(templateId);
            if (template == null)
            {
                return new GenerateFromTemplateResponse
                {
                    Status = "Failed",
                    Message = "Template not found",
                    TemplateId = request.TemplateId
                };
            }

            // Check if content already exists for this project and endpoint
            var existingContent = await _generatedContentRepository.GetByProjectAndPathAsync(template.ProjectId, template.Path ?? "");
            if (existingContent != null)
            {
                _logger.LogInformation("Content already exists for project {ProjectId} and path {Path}", 
                    template.ProjectId, template.Path);
                return new GenerateFromTemplateResponse
                {
                    ContentId = existingContent.Id.ToString(),
                    Status = "AlreadyExists",
                    Message = "Content already exists for this template",
                    TemplateId = request.TemplateId,
                    ProjectId = template.ProjectId.ToString(),
                    EndpointPath = template.Path ?? ""
                };
            }

            // Generate content using Generator service
            var generationResult = await _generatorService.GenerateContentAsync(template.Schema);
            if (!generationResult.Success)
            {
                return new GenerateFromTemplateResponse
                {
                    Status = "Failed",
                    Message = generationResult.ErrorMessage ?? "Content generation failed",
                    TemplateId = request.TemplateId,
                    ProjectId = template.ProjectId.ToString(),
                    EndpointPath = template.Path ?? ""
                };
            }

            // Store generated content in database
            var generatedContent = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TemplateId = templateId,
                ProjectId = template.ProjectId,
                EndpointPath = template.Path ?? "",
                UserId = userId,
                GeneratedData = generationResult.GeneratedData!,
                Schema = template.Schema,
                Status = "Completed",
                TemplateName = template.Name,
                ProjectTitle = template.ProjectTitle
            };

            await _generatedContentRepository.AddAsync(generatedContent);

            _logger.LogInformation("Successfully generated and stored content {ContentId} for template {TemplateId}", 
                generatedContent.Id, request.TemplateId);

            return new GenerateFromTemplateResponse
            {
                ContentId = generatedContent.Id.ToString(),
                Status = "Completed",
                Message = "Content generated successfully",
                TemplateId = request.TemplateId,
                ProjectId = template.ProjectId.ToString(),
                EndpointPath = template.Path ?? ""
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating content for template {TemplateId}", request.TemplateId);
            return new GenerateFromTemplateResponse
            {
                Status = "Failed",
                Message = $"Internal error: {ex.Message}",
                TemplateId = request.TemplateId
            };
        }
    }

    public override async Task<GetTemplateResponse> GetTemplate(GetTemplateRequest request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Fetching template {TemplateId}", request.TemplateId);

            if (!Guid.TryParse(request.TemplateId, out var templateId))
            {
                return new GetTemplateResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid template ID format"
                };
            }

            var template = await _backendService.GetTemplateAsync(templateId);
            if (template == null)
            {
                return new GetTemplateResponse
                {
                    Success = false,
                    ErrorMessage = "Template not found"
                };
            }

            return new GetTemplateResponse
            {
                TemplateId = template.Id.ToString(),
                Name = template.Name,
                Schema = template.Schema,
                Path = template.Path ?? "",
                ProjectId = template.ProjectId.ToString(),
                ProjectTitle = template.ProjectTitle,
                Success = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching template {TemplateId}", request.TemplateId);
            return new GetTemplateResponse
            {
                Success = false,
                ErrorMessage = $"Internal error: {ex.Message}"
            };
        }
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
