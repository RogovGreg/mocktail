using Grpc.Core;
using Generator.Protos;
using Generator.Integrations;
using Generator.Data;
using Microsoft.EntityFrameworkCore;
using Generator.Entities;

namespace Generator.Services;

public class GeneratorServiceImpl : GeneratorService.GeneratorServiceBase
{
    private readonly ILogger<GeneratorServiceImpl> _logger;
    private readonly GeneratorDbContext _db;

    public GeneratorServiceImpl(ILogger<GeneratorServiceImpl> logger, GeneratorDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    public override async Task<GenerateContentResponse> GenerateContent(GenerateContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("GenerateContent gRPC endpoint called with schema length: {Length}", request.Schema.Length);

        int amount = request.Amount > 0 ? request.Amount : 1;
        int retries = 3;
        for (int i = 0; i < retries; i++)
        {
            try
            {
                var generatedContent = await OpenAIIntegration.GenerateObjects(request.Schema, amount);

                _logger.LogInformation("Successfully generated content with length: {Length}", generatedContent.Length);

                return new GenerateContentResponse
                {
                    Success = true,
                    GeneratedData = generatedContent
                };
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Error generating content, retrying... Attempt {Attempt}", i + 1);
            }
        }
        return new GenerateContentResponse
        {
            Success = false,
            ErrorMessage = "Failed to generate content after multiple attempts."
        };
    }

    public override async Task<GetProjectConfigResponse> GetProjectConfig(
        GetProjectConfigRequest request,
        ServerCallContext context
    )
    {
        if (!Guid.TryParse(request.ProjectId, out var projectId))
        {
            return new GetProjectConfigResponse { Found = false, ErrorMessage = "Invalid project_id format" };
        }

        var cfg = await _db.ProjectConfigs.FirstOrDefaultAsync(c => c.ProjectId == projectId);
        if (cfg == null)
        {
            return new GetProjectConfigResponse {
                Found = false,
                ProjectId = request.ProjectId
            };
        }

        return new GetProjectConfigResponse
        {
            Found = true,
            ProjectId = cfg.ProjectId.ToString(),
            OpenAiKey = cfg.OpenAiKey ?? string.Empty,
            Model = cfg.Model ?? string.Empty
        };
    }

    public override async Task<SetProjectConfigResponse> SetProjectConfig(SetProjectConfigRequest request, ServerCallContext context)
    {
        if (!Guid.TryParse(request.ProjectId, out var projectId))
        {
            return new SetProjectConfigResponse { Success = false, ErrorMessage = "Invalid project_id format" };
        }

        try
        {
            var cfg = await _db.ProjectConfigs.FirstOrDefaultAsync(c => c.ProjectId == projectId);
            if (cfg == null)
            {
                cfg = new Generator.Entities.ProjectConfig
                {
                    Id = Guid.NewGuid(),
                    ProjectId = projectId,
                    OpenAiKey = request.OpenAiKey ?? string.Empty,
                    Model = request.Model ?? string.Empty
                };
                _db.ProjectConfigs.Add(cfg);
            }
            else
            {
                cfg.OpenAiKey = request.OpenAiKey ?? string.Empty;
                cfg.Model = request.Model ?? string.Empty;
            }

            await _db.SaveChangesAsync();
            return new SetProjectConfigResponse { Success = true };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to set project config for {ProjectId}", request.ProjectId);
            return new SetProjectConfigResponse { Success = false, ErrorMessage = ex.Message };
        }
    }
}
