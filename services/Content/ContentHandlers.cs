using Microsoft.AspNetCore.Http;

public static class ContentHandlers
{
  public class GenerateFromTemplateRequest
  {
    public string? Schema { get; set; }
  }

  public static IResult HandleGenerateFromTemplate(Guid id, GenerateFromTemplateRequest request)
  {
    if (request.Schema == null)
    {
      return Results.BadRequest(new { error = "Schema is required" });
    }

    return Results.Ok(new
    {
      message = $"Request received to generate content using template {id} with the provided schema",
      templateId = id,
      schema = request.Schema
    });
  }
}