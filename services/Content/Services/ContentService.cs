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

            // Create pending content entry first
            var generatedContent = new GeneratedContent
            {
                Id = Guid.NewGuid(),
                TemplateId = templateId,
                ProjectId = templateData.ProjectId,
                EndpointPath = templateData.Path,
                UserId = userId,
                GeneratedData = "{}", // Empty JSON object initially
                Schema = templateData.Schema,
                Status = "Pending",
                TemplateName = templateData.Name,
                ProjectTitle = templateData.ProjectTitle,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await _generatedContentRepository.AddAsync(generatedContent);
            _logger.LogInformation("Created pending content entry {ContentId} for template {TemplateId}", 
                generatedContent.Id, request.TemplateId);

            // Start generation asynchronously
            _ = Task.Run(async () =>
            {
                try
                {
                    _logger.LogInformation("Starting async generation for content {ContentId}", generatedContent.Id);
                    
                    // Generate content using Generator service
                    var generationResult = await _generatorService.GenerateContentAsync(templateData.Schema);
                    
                    if (generationResult.Success)
                    {
                        // Update the content with generated data
                        await _generatedContentRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Completed", generationResult.GeneratedData!);
                        
                        _logger.LogInformation("Successfully generated and updated content {ContentId}", generatedContent.Id);
                    }
                    else
                    {
                        // Update status to Failed
                        await _generatedContentRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Failed", "{}");
                        
                        _logger.LogError("Failed to generate content {ContentId}: {Error}", 
                            generatedContent.Id, generationResult.ErrorMessage);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during async generation for content {ContentId}", generatedContent.Id);
                    
                    try
                    {
                        // Update status to Failed
                        await _generatedContentRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Failed", "{}");
                    }
                    catch (Exception updateEx)
                    {
                        _logger.LogError(updateEx, "Failed to update status to Failed for content {ContentId}", generatedContent.Id);
                    }
                }
            });

            // Return immediately with pending status
            return new GenerateFromTemplateResponse
            {
                ContentId = generatedContent.Id.ToString(),
                Status = "Pending",
                Message = "Content generation started. Check status later.",
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

    public override async Task<GetGeneratedContentStatusResponse> GetGeneratedContentStatus(GetGeneratedContentStatusRequest request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Fetching status for generated content {ContentId}", request.ContentId);

            if (!Guid.TryParse(request.ContentId, out var contentId))
            {
                return new GetGeneratedContentStatusResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid content ID format"
                };
            }

            var content = await _generatedContentRepository.GetByIdAsync(contentId);
            if (content == null)
            {
                return new GetGeneratedContentStatusResponse
                {
                    Success = false,
                    ErrorMessage = "Generated content not found"
                };
            }

            return new GetGeneratedContentStatusResponse
            {
                ContentId = content.Id.ToString(),
                Status = content.Status,
                TemplateId = content.TemplateId.ToString(),
                ProjectId = content.ProjectId.ToString(),
                EndpointPath = content.EndpointPath,
                CreatedAt = content.CreatedAt.ToUnixTimeMilliseconds(),
                UpdatedAt = content.UpdatedAt.ToUnixTimeMilliseconds(),
                Success = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching generated content status {ContentId}", request.ContentId);
            return new GetGeneratedContentStatusResponse
            {
                Success = false,
                ErrorMessage = $"Internal error: {ex.Message}"
            };
        }
    }

}
