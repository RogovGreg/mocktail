using System.Text.Json;

namespace Content.Services;

public interface IGeneratorService
{
    Task<GenerationResult> GenerateContentAsync(
        string schema,
        Guid projectId,
        CancellationToken cancellationToken = default,
        int amount = 10
    );
}

public record GenerationResult(
    bool Success,
    string? GeneratedData,
    string? ErrorMessage
);
