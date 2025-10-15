using Content.Messages;

namespace Content.Services;

public interface IRabbitMqPublisher
{
    Task PublishContentGenerationAsync(ContentGenerationMessage message);
}
