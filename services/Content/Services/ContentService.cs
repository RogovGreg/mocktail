using Grpc.Core;
using Shared.Content.Protos;
using Content.Repositories;
using Content.Entities;
using Content.Messages;

namespace Content.Services;

public class ContentServiceImpl : ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly IGeneratedContentRepository _generatedContentRepository;
    private readonly IRabbitMqPublisher _rabbitMqPublisher;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ICacheService _cacheService;

    public ContentServiceImpl(
        ILogger<ContentServiceImpl> logger, 
        IGeneratedContentRepository generatedContentRepository,
        IRabbitMqPublisher rabbitMqPublisher,
        IServiceScopeFactory serviceScopeFactory,
        ICacheService cacheService)
    {
        _logger = logger;
        _generatedContentRepository = generatedContentRepository;
        _rabbitMqPublisher = rabbitMqPublisher;
        _serviceScopeFactory = serviceScopeFactory;
        _cacheService = cacheService;
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

            // Check if content already exists for this template (any version)
            var existingContent = await _generatedContentRepository.GetLatestByTemplateIdAsync(templateId);
            
            GeneratedContent generatedContent;
            
            if (existingContent != null)
            {
                _logger.LogInformation("Updating existing content {ContentId} for template {TemplateId} version {Version}", 
                    existingContent.Id, templateId, request.TemplateVersion);
                
                // Update existing content
                existingContent.Status = "Pending";
                existingContent.TemplateVersion = request.TemplateVersion;
                existingContent.GeneratedData = "{}"; // Reset to empty JSON
                existingContent.UpdatedAt = DateTimeOffset.UtcNow;
                existingContent.UserId = userId; // Update user who triggered regeneration
                
                generatedContent = await _generatedContentRepository.UpdateAsync(existingContent);
            }
            else
            {
                _logger.LogInformation("Creating new content for template {TemplateId} version {Version}", 
                    templateId, request.TemplateVersion);

                // Create new content entry
                generatedContent = new GeneratedContent
                {
                    Id = Guid.NewGuid(),
                    TemplateId = templateId,
                    TemplateVersion = request.TemplateVersion,
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
            }
            _logger.LogInformation("Prepared content entry {ContentId} for template {TemplateId} (Status: {Status})", 
                generatedContent.Id, request.TemplateId, generatedContent.Status);

            // Publish message to RabbitMQ queue for background processing
            var message = new ContentGenerationMessage
            {
                ContentId = generatedContent.Id,
                TemplateId = templateId,
                TemplateVersion = request.TemplateVersion,
                UserId = userId,
                TemplateName = templateData.Name,
                Schema = templateData.Schema,
                Path = templateData.Path,
                ProjectId = templateData.ProjectId,
                ProjectTitle = templateData.ProjectTitle,
                Amount = request.Amount,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _rabbitMqPublisher.PublishContentGenerationAsync(message);
            _logger.LogInformation("Published content generation message for content {ContentId} to queue", generatedContent.Id);

            // Return immediately with pending status
            return new GenerateFromTemplateResponse
            {
                ContentId = generatedContent.Id.ToString(),
                Status = "Pending",
                Message = "Content generation started. Check status later.",
                TemplateId = request.TemplateId,
                TemplateVersion = request.TemplateVersion,
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

    public override async Task<GetLatestContentByTemplateResponse> GetLatestContentByTemplate(GetLatestContentByTemplateRequest request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Fetching latest content for template {TemplateId}", request.TemplateId);

            if (!Guid.TryParse(request.TemplateId, out var templateId))
            {
                return new GetLatestContentByTemplateResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid template ID format"
                };
            }

            var content = await _generatedContentRepository.GetLatestByTemplateIdAsync(templateId);
            if (content == null)
            {
                return new GetLatestContentByTemplateResponse
                {
                    Success = false,
                    ErrorMessage = "No generated content found for this template"
                };
            }

            return new GetLatestContentByTemplateResponse
            {
                ContentId = content.Id.ToString(),
                Status = content.Status,
                TemplateId = content.TemplateId.ToString(),
                TemplateVersion = content.TemplateVersion,
                ProjectId = content.ProjectId.ToString(),
                EndpointPath = content.EndpointPath,
                CreatedAt = content.CreatedAt.ToUnixTimeMilliseconds(),
                UpdatedAt = content.UpdatedAt.ToUnixTimeMilliseconds(),
                Success = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching latest content for template {TemplateId}", request.TemplateId);
            return new GetLatestContentByTemplateResponse
            {
                Success = false,
                ErrorMessage = $"Internal error: {ex.Message}"
            };
        }
    }

    public override async Task<MarkContentAsStaleResponse> MarkContentAsStale(MarkContentAsStaleRequest request, ServerCallContext context)
    {
        try
        {
            _logger.LogInformation("Marking content as stale for template {TemplateId}, from version {FromVersion}", 
                request.TemplateId, request.FromVersion);

            if (!Guid.TryParse(request.TemplateId, out var templateId))
            {
                return new MarkContentAsStaleResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid template ID format"
                };
            }

            // Mark all content with template version <= fromVersion as stale
            var affectedCount = await _generatedContentRepository.MarkAsStaleByTemplateAndVersionAsync(templateId, request.FromVersion);

            // Get the project ID and path from the template to invalidate specific cache
            var latestContent = await _generatedContentRepository.GetLatestByTemplateIdAsync(templateId);
            if (latestContent != null)
            {
                await _cacheService.InvalidateContentCacheAsync(latestContent.ProjectId, latestContent.EndpointPath);
                _logger.LogInformation("Invalidated cache for project {ProjectId} and path {EndpointPath} after marking content as stale", 
                    latestContent.ProjectId, latestContent.EndpointPath);
            }

            return new MarkContentAsStaleResponse
            {
                AffectedCount = affectedCount,
                Success = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking content as stale for template {TemplateId}", request.TemplateId);
            return new MarkContentAsStaleResponse
            {
                Success = false,
                ErrorMessage = $"Internal error: {ex.Message}"
            };
        }
    }

}
