using Grpc.Core;
using Generator.Protos;

namespace Generator.Services;

public class GeneratorServiceImpl : GeneratorService.GeneratorServiceBase
{
    private readonly ILogger<GeneratorServiceImpl> _logger;

    public GeneratorServiceImpl(ILogger<GeneratorServiceImpl> logger)
    {
        _logger = logger;
    }

    public override Task<GenerateContentResponse> GenerateContent(GenerateContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("GenerateContent gRPC endpoint called with schema length: {Length}", request.Schema.Length);

        // TODO: This is a placeholder implementation
        // The actual generation logic should be implemented in another ticket
        
        var response = new GenerateContentResponse
        {
            Success = false,
            ErrorMessage = "Generator service not yet implemented. This is a placeholder endpoint."
        };

        _logger.LogWarning("Generator service called but not implemented - returning placeholder response");

        return Task.FromResult(response);
    }
}
