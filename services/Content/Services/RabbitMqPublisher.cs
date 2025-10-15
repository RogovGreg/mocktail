using RabbitMQ.Client;
using Content.Messages;

namespace Content.Services;

public class RabbitMqPublisher : IRabbitMqPublisher, IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly ILogger<RabbitMqPublisher> _logger;
    private readonly string _queueName = "content-generation-queue";

    public RabbitMqPublisher(IConfiguration configuration, ILogger<RabbitMqPublisher> logger)
    {
        _logger = logger;
        
        var connectionString = configuration.GetConnectionString("RabbitMQ");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'RabbitMQ' not found. Make sure the environment variable 'ConnectionStrings__RabbitMQ' is set.");
        }

        var factory = new ConnectionFactory
        {
            Uri = new Uri(connectionString),
            AutomaticRecoveryEnabled = true,
            NetworkRecoveryInterval = TimeSpan.FromSeconds(10)
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // Declare the queue as durable
        _channel.QueueDeclare(
            queue: _queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        _logger.LogInformation("RabbitMQ publisher initialized with queue '{QueueName}'", _queueName);
    }

    public Task PublishContentGenerationAsync(ContentGenerationMessage message)
    {
        try
        {
            var messageJson = message.ToJson();
            var body = System.Text.Encoding.UTF8.GetBytes(messageJson);

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true; // Make message persistent
            properties.MessageId = message.ContentId.ToString();
            properties.Timestamp = new AmqpTimestamp(message.CreatedAt.ToUnixTimeSeconds());

            _channel.BasicPublish(
                exchange: "",
                routingKey: _queueName,
                basicProperties: properties,
                body: body);

            _logger.LogInformation("Published content generation message for content {ContentId} to queue", message.ContentId);
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish content generation message for content {ContentId}", message.ContentId);
            throw;
        }
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}
