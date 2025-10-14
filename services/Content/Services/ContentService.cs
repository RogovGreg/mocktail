using Grpc.Core;
using Shared.Content.Protos;
using Content.Repositories;
using Content.Entities;

namespace Content.Services;

public class ContentServiceImpl : ContentService.ContentServiceBase
{
    private readonly ILogger<ContentServiceImpl> _logger;
    private readonly IGeneratedContentRepository _generatedContentRepository;
    private readonly IGeneratorService _generatorService;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ICacheService _cacheService;

    public ContentServiceImpl(
        ILogger<ContentServiceImpl> logger, 
        IGeneratedContentRepository generatedContentRepository,
        IGeneratorService generatorService,
        IServiceScopeFactory serviceScopeFactory,
        ICacheService cacheService)
    {
        _logger = logger;
        _generatedContentRepository = generatedContentRepository;
        _generatorService = generatorService;
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

            // Start generation asynchronously
            _ = Task.Run(async () =>
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var scopedRepository = scope.ServiceProvider.GetRequiredService<IGeneratedContentRepository>();
                var scopedGeneratorService = scope.ServiceProvider.GetRequiredService<IGeneratorService>();
                var scopedCacheService = scope.ServiceProvider.GetRequiredService<ICacheService>();
                
                try
                {
                    _logger.LogInformation("Starting async generation for content {ContentId}", generatedContent.Id);
                    
                    // Generate content using Generator service
                    var generationResult = await scopedGeneratorService.GenerateContentAsync(templateData.Schema);
                    
                    if (generationResult.Success)
                    {
                        // Validate that the generated data is valid JSON
                        string jsonData = generationResult.GeneratedData!;
                        try
                        {
                            // Try to parse as JSON to validate
                            System.Text.Json.JsonDocument.Parse(jsonData);
                            
                            // Update the content with generated data
                            await scopedRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Completed", jsonData);
                            
                            // Invalidate cache for this specific project and path to ensure fresh data
                            await scopedCacheService.InvalidateContentCacheAsync(templateData.ProjectId, templateData.Path);
                            
                            _logger.LogInformation("Successfully generated and updated content {ContentId}, invalidated cache for project {ProjectId}", 
                                generatedContent.Id, templateData.ProjectId);
                        }
                        catch (System.Text.Json.JsonException jsonEx)
                        {
                            _logger.LogError(jsonEx, "Invalid JSON returned from Generator service for content {ContentId}: {JsonData}", 
                                generatedContent.Id, jsonData);
                            
                            // Store error information as valid JSON
                            var errorJson = System.Text.Json.JsonSerializer.Serialize(new { 
                                error = "Invalid JSON from generator", 
                                originalData = jsonData,
                                timestamp = DateTimeOffset.UtcNow.ToString("O")
                            });
                            
                            await scopedRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Failed", errorJson);
                            
                            // Invalidate cache even for failed content to ensure consistency
                            await scopedCacheService.InvalidateContentCacheAsync(templateData.ProjectId, templateData.Path);
                        }
                    }
                    else
                    {
                        // Update status to Failed
                        await scopedRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Failed", "{}");
                        
                        // Invalidate cache for failed content
                        await scopedCacheService.InvalidateContentCacheAsync(templateData.ProjectId, templateData.Path);
                        
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
                        await scopedRepository.UpdateStatusAndDataAsync(generatedContent.Id, "Failed", "{}");
                        
                        // Invalidate cache on error
                        await scopedCacheService.InvalidateContentCacheAsync(templateData.ProjectId, templateData.Path);
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
