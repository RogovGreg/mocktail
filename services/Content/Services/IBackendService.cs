using System.Text.Json;

namespace Content.Services;

public interface IBackendService
{
    Task<TemplateInfo?> GetTemplateAsync(Guid templateId);
}

public record TemplateInfo(
    Guid Id,
    string Name,
    string Schema,
    string? Path,
    Guid ProjectId,
    string ProjectTitle
);
