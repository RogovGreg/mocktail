using OpenAI.Chat;
using System.Text.Json;


namespace Generator.Integrations;


public class OpenAIIntegration
{
    private static readonly ChatClient client = new(model: "gpt-4o-mini", apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY"));
    private static readonly ILogger logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("Program");

    private static readonly JsonSerializerOptions jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task<IResult> Prompt(HttpContext context)
    {
        try
        {
            var request = await JsonSerializer.DeserializeAsync<PromptRequest>(context.Request.Body, jsonOptions);
            if (request == null || string.IsNullOrEmpty(request.Prompt))
            {
                return Results.BadRequest("Invalid request");
            }

            logger.LogInformation("[LLM Prompt]: {Prompt}", request.Prompt);

            ChatCompletion completion = client.CompleteChat(request.Prompt);
            var response = completion.Content[0].Text;
            logger.LogInformation("[LLM Response]: {Response}", response);

            return Results.Json(new { response });
        }
        catch (JsonException)
        {
            return Results.BadRequest("Invalid JSON");
        }
    }
}

record PromptRequest(string Prompt);
