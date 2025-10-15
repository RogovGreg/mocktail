using Generator.Protos;

namespace Content.Services;

public class GeneratorService : IGeneratorService
{
    private readonly Generator.Protos.GeneratorService.GeneratorServiceClient _grpcClient;
    private readonly ILogger<GeneratorService> _logger;

    public GeneratorService(Generator.Protos.GeneratorService.GeneratorServiceClient grpcClient, ILogger<GeneratorService> logger)
    {
        _grpcClient = grpcClient;
        _logger = logger;
    }

    public async Task<GenerationResult> GenerateContentAsync(string schema, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Generating content using Generator service via gRPC");

            var request = new GenerateContentRequest
            {
                Schema = schema
            };

            var response = await _grpcClient.GenerateContentAsync(request, cancellationToken: cancellationToken);

            if (!response.Success)
            {
                _logger.LogError("Generator service returned error: {Error}", response.ErrorMessage);
                return new GenerationResult(false, null, response.ErrorMessage);
            }

            _logger.LogInformation("Successfully generated content with {Length} characters", response.GeneratedData.Length);
            return new GenerationResult(true, response.GeneratedData, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Generator service via gRPC");
            return new GenerationResult(false, null, $"Generator service error: {ex.Message}");
        }
    }
}
