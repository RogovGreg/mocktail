using System.Text.Json;

namespace Content.Services;

public interface IGeneratorService
{
    Task<GenerationResult> GenerateContentAsync(string schema);
}

public record GenerationResult(
    bool Success,
    string? GeneratedData,
    string? ErrorMessage
);
