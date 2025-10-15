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

    private static string makeOpenAIRequest(string prompt)
    {
        ChatCompletion completion = client.CompleteChat(prompt);
        var response = completion.Content[0].Text;
        return response;
    }

    // Unused for now, implemented as demo
    // public static async Task<IResult> Prompt(HttpContext context)
    // {
    //     try
    //     {
    //         var request = await JsonSerializer.DeserializeAsync<PromptRequest>(context.Request.Body, jsonOptions);
    //         if (request == null || string.IsNullOrEmpty(request.Prompt))
    //         {
    //             return Results.BadRequest("Invalid request");
    //         }

    //         logger.LogInformation("[LLM Prompt]: {Prompt}", request.Prompt);

    //         var response = makeOpenAIRequest(request.Prompt);
    //         logger.LogInformation("[LLM Response]: {Response}", response);

    //         return Results.Json(new { response });
    //     }
    //     catch (JsonException)
    //     {
    //         return Results.BadRequest("Invalid JSON");
    //     }
    // }

    public static async Task<string> GenerateObjects(string schema, int amount = 10)
    {
        if (string.IsNullOrEmpty(schema) || amount <= 0)
        {
            throw new ArgumentException("Invalid schema or amount");
        }

        string prompt =
            $"Generate {amount} JSON objects that match the following typescript schema: \n```{schema}```\n"
            + "The response should be a JSON array of objects, do not add any explanation text. \n";

        logger.LogInformation("[LLM Prompt]: {Prompt}", prompt);

        // Make the OpenAI request asynchronously
        var completion = await client.CompleteChatAsync(prompt);
        string response = completion.Value.Content[0].Text
            .Replace("```json", string.Empty)
            .Replace("```", string.Empty)
            .Trim();

        logger.LogInformation("[LLM Response]: {Response}", response);

        // Validate that the response is valid JSON
        try
        {
            JsonSerializer.Deserialize<JsonElement>(response, jsonOptions);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Generated content is not valid JSON");
            throw new InvalidOperationException("OpenAI generated invalid JSON content", ex);
        }

        return response;
    }
}

record PromptRequest(string Prompt);
record GenerateRequest(string jsonSchema, int amount);
