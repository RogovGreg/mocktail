using Grpc.Core;
using Generator.Protos;
using Generator.Integrations;

namespace Generator.Services;

public class GeneratorServiceImpl : GeneratorService.GeneratorServiceBase
{
    private readonly ILogger<GeneratorServiceImpl> _logger;

    public GeneratorServiceImpl(ILogger<GeneratorServiceImpl> logger)
    {
        _logger = logger;
    }

    public override async Task<GenerateContentResponse> GenerateContent(GenerateContentRequest request, ServerCallContext context)
    {
        _logger.LogInformation("GenerateContent gRPC endpoint called with schema length: {Length}", request.Schema.Length);

        // Use OpenAIIntegration.Generate to generate content based on the schema
        var generatedContent = await OpenAIIntegration.Generate(request.Schema, 10);

        _logger.LogInformation("Successfully generated content with length: {Length}", generatedContent.Length);

        return new GenerateContentResponse
        {
            Success = true,
            GeneratedData = generatedContent
        };
    }
}
