using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Content.Services;

public class BackendService : IBackendService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<BackendService> _logger;
    private readonly BackendServiceOptions _options;

    public BackendService(HttpClient httpClient, ILogger<BackendService> logger, IOptions<BackendServiceOptions> options)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = options.Value;
    }

    public async Task<TemplateInfo?> GetTemplateAsync(Guid templateId)
    {
        try
        {
            _logger.LogInformation("Fetching template {TemplateId} from Backend service", templateId);
            
            var response = await _httpClient.GetAsync($"/templates/{templateId}");
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch template {TemplateId}. Status: {StatusCode}", 
                    templateId, response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var template = JsonSerializer.Deserialize<TemplateDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (template == null)
            {
                _logger.LogWarning("Template {TemplateId} deserialization returned null", templateId);
                return null;
            }

            // Fetch project info to get project title
            var projectResponse = await _httpClient.GetAsync($"/projects/{template.RelatedProjectId}");
            string? projectTitle = "Unknown Project";
            
            if (projectResponse.IsSuccessStatusCode)
            {
                var projectJson = await projectResponse.Content.ReadAsStringAsync();
                var project = JsonSerializer.Deserialize<ProjectDto>(projectJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                projectTitle = project?.Title ?? "Unknown Project";
            }

            return new TemplateInfo(
                template.Id,
                template.Name,
                template.Schema,
                template.Path,
                template.RelatedProjectId,
                projectTitle
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching template {TemplateId} from Backend service", templateId);
            return null;
        }
    }

    private record TemplateDto(
        Guid Id,
        string Name,
        string Schema,
        string? Path,
        Guid RelatedProjectId
    );

    private record ProjectDto(
        Guid Id,
        string Title
    );
}

public class BackendServiceOptions
{
    public string BaseUrl { get; set; } = "http://backend:80";
}
