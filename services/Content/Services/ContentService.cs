using Grpc.Core;
using Shared.Content.Protos;
using Content.Repositories;
using Content.Entities;

namespace Content.Services;

public class ContentServiceImpl : ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly IGeneratedContentRepository _generatedContentRepository;
    private readonly IBackendService _backendService;
    private readonly IGeneratorService _generatorService;

    public ContentServiceImpl(
        ILogger<ContentServiceImpl> logger, 
        IGeneratedContentRepository generatedContentRepository,
        IBackendService backendService,
        IGeneratorService generatorService)
    {
        _logger = logger;
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

            // Use template data from the request instead of fetching from Backend
            var templateData = new
            {
                Id = templateId,
                Name = request.TemplateName,
                Schema = request.Schema,
                Path = request.Path,
                ProjectId = Guid.Parse(request.ProjectId),
                ProjectTitle = request.ProjectTitle
            };

            // Check if content already exists for this project and endpoint
            var existingContent = await _generatedContentRepository.GetByProjectAndPathAsync(templateData.ProjectId, templateData.Path);
            if (existingContent != null)
            {
                _logger.LogInformation("Content already exists for project {ProjectId} and path {Path}", 
                    templateData.ProjectId, templateData.Path);
                return new GenerateFromTemplateResponse
                {
                    ContentId = existingContent.Id.ToString(),
                    Status = "AlreadyExists",
                    Message = "Content already exists for this template",
                    TemplateId = request.TemplateId,
                    ProjectId = templateData.ProjectId.ToString(),
                    EndpointPath = templateData.Path
                };
            }

            // Generate content using Generator service
            var generationResult = await _generatorService.GenerateContentAsync(templateData.Schema);
            if (!generationResult.Success)
            {
                return new GenerateFromTemplateResponse
                {
                    Status = "Failed",
                    Message = generationResult.ErrorMessage ?? "Content generation failed",
                    TemplateId = request.TemplateId,
                    ProjectId = templateData.ProjectId.ToString(),
                    EndpointPath = templateData.Path
                };
            }

            // Store generated content in database
            var generatedContent = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TemplateId = templateId,
                ProjectId = templateData.ProjectId,
                EndpointPath = templateData.Path,
                UserId = userId,
                GeneratedData = generationResult.GeneratedData!,
                Schema = templateData.Schema,
                Status = "Completed",
                TemplateName = templateData.Name,
                ProjectTitle = templateData.ProjectTitle
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
                ProjectId = templateData.ProjectId.ToString(),
                EndpointPath = templateData.Path
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

}
