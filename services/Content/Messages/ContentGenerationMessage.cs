using System.Text.Json;

namespace Content.Messages;

public class ContentGenerationMessage
{
    public Guid ContentId { get; set; }
    public Guid TemplateId { get; set; }
    public int TemplateVersion { get; set; }
    public Guid UserId { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public string Schema { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public int Amount { get; set; } = 10;
    public DateTimeOffset CreatedAt { get; set; }

    public string ToJson()
    {
        return JsonSerializer.Serialize(this);
    }

    public static ContentGenerationMessage FromJson(string json)
    {
        return JsonSerializer.Deserialize<ContentGenerationMessage>(json) 
            ?? throw new InvalidOperationException("Failed to deserialize ContentGenerationMessage");
    }
}
