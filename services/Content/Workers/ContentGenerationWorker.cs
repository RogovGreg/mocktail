using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Content.Messages;
using Content.Repositories;
using Content.Services;
using Content.Entities;

namespace Content.Workers;

public class ContentGenerationWorker : BackgroundService
{
    private IConnection _connection;
    private IModel _channel;
    private readonly ILogger<ContentGenerationWorker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly string _queueName = "content-generation-queue";
    private readonly string _connectionString;

    public ContentGenerationWorker(IConfiguration configuration, ILogger<ContentGenerationWorker> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;

        var connectionString = configuration.GetConnectionString("RabbitMQ");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Connection string 'RabbitMQ' not found. Make sure the environment variable 'ConnectionStrings__RabbitMQ' is set.");
        }

        _connectionString = connectionString;
        _logger.LogInformation("Content generation worker constructor completed. RabbitMQ connection will be established in ExecuteAsync.");
    }

    private async Task WaitForRabbitMQConnectionAsync(CancellationToken stoppingToken)
    {
        var maxRetries = 30; // 30 retries
        var baseDelay = TimeSpan.FromSeconds(2); // Start with 2 seconds
        
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                _logger.LogInformation("Attempting to connect to RabbitMQ (attempt {Attempt}/{MaxRetries})", attempt, maxRetries);
                
                var factory = new ConnectionFactory
                {
                    Uri = new Uri(_connectionString),
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

                // Set prefetch count to 1 to process one message at a time
                _channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                _logger.LogInformation("Successfully connected to RabbitMQ and initialized queue '{QueueName}'", _queueName);
                return; // Success!
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to connect to RabbitMQ on attempt {Attempt}/{MaxRetries}", attempt, maxRetries);
                
                if (attempt == maxRetries)
                {
                    _logger.LogError("Failed to connect to RabbitMQ after {MaxRetries} attempts. Giving up.", maxRetries);
                    throw;
                }
                
                // Exponential backoff: 2s, 4s, 8s, 16s, 30s, 30s, ...
                var delay = TimeSpan.FromMilliseconds(Math.Min(baseDelay.TotalMilliseconds * Math.Pow(2, attempt - 1), 30000));
                _logger.LogInformation("Waiting {Delay} seconds before next attempt...", delay.TotalSeconds);
                
                await Task.Delay(delay, stoppingToken);
            }
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Wait for RabbitMQ to be ready with retry logic
        await WaitForRabbitMQConnectionAsync(stoppingToken);
        
        var consumer = new EventingBasicConsumer(_channel);
        
        consumer.Received += async (model, ea) =>
        {
            var deliveryTag = ea.DeliveryTag;
            var messageBody = ea.Body.ToArray();
            var messageJson = System.Text.Encoding.UTF8.GetString(messageBody);
            
            try
            {
                var message = ContentGenerationMessage.FromJson(messageJson);
                _logger.LogInformation("Processing content generation message for content {ContentId}", message.ContentId);

                await ProcessContentGenerationAsync(message);
                
                // Acknowledge the message
                _channel.BasicAck(deliveryTag, false);
                _logger.LogInformation("Successfully processed content generation message for content {ContentId}", message.ContentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing content generation message: {MessageJson}", messageJson);
                
                try
                {
                    // Try to parse message to get content ID for error handling
                    var message = ContentGenerationMessage.FromJson(messageJson);
                    await MarkContentAsFailedAsync(message.ContentId);
                }
                catch (Exception parseEx)
                {
                    _logger.LogError(parseEx, "Failed to parse message for error handling");
                }
                
                // Acknowledge the message even on failure (no retries per requirements)
                _channel.BasicAck(deliveryTag, false);
            }
        };

        _channel.BasicConsume(
            queue: _queueName,
            autoAck: false,
            consumer: consumer);

        _logger.LogInformation("Content generation worker started consuming messages");

        // Keep the service running
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task ProcessContentGenerationAsync(ContentGenerationMessage message)
    {
        using var scope = _serviceProvider.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IGeneratedContentRepository>();
        var generatorService = scope.ServiceProvider.GetRequiredService<IGeneratorService>();
        var cacheService = scope.ServiceProvider.GetRequiredService<ICacheService>();

        // Check if content is still pending (idempotency check)
        var content = await repository.GetByIdAsync(message.ContentId);
        if (content == null)
        {
            _logger.LogWarning("Content {ContentId} not found in database", message.ContentId);
            return;
        }

        if (content.Status != "Pending")
        {
            _logger.LogInformation("Content {ContentId} is no longer pending (status: {Status}), skipping generation", 
                message.ContentId, content.Status);
            return;
        }

        // Create a cancellation token with 60-second timeout
        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(1));
        
        try
        {
            _logger.LogInformation("Starting content generation for content {ContentId}", message.ContentId);
            
            // Generate content using Generator service with timeout
            var generationResult = await generatorService.GenerateContentAsync(message.Schema, message.ProjectId, cts.Token, message.Amount);

            if (generationResult.Success)
            {
                // Validate that the generated data is valid JSON
                string jsonData = generationResult.GeneratedData!;
                try
                {
                    // Try to parse as JSON to validate
                    System.Text.Json.JsonDocument.Parse(jsonData);

                    // Update the content with generated data
                    await repository.UpdateStatusAndDataAsync(message.ContentId, "Completed", jsonData);

                    // Invalidate cache for this specific project and path to ensure fresh data
                    await cacheService.InvalidateContentCacheAsync(message.ProjectId, message.Path);

                    _logger.LogInformation("Successfully generated and updated content {ContentId}, invalidated cache for project {ProjectId}",
                        message.ContentId, message.ProjectId);
                }
                catch (System.Text.Json.JsonException jsonEx)
                {
                    _logger.LogError(jsonEx, "Invalid JSON returned from Generator service for content {ContentId}: {JsonData}",
                        message.ContentId, jsonData);

                    // Store error information as valid JSON
                    var errorJson = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        error = "Invalid JSON from generator",
                        originalData = jsonData,
                        timestamp = DateTimeOffset.UtcNow.ToString("O")
                    });

                    await repository.UpdateStatusAndDataAsync(message.ContentId, "Failed", errorJson);

                    // Invalidate cache even for failed content to ensure consistency
                    await cacheService.InvalidateContentCacheAsync(message.ProjectId, message.Path);
                }
            }
            else
            {
                // Update status to Failed
                await repository.UpdateStatusAndDataAsync(message.ContentId, "Failed", "{}");

                // Invalidate cache for failed content
                await cacheService.InvalidateContentCacheAsync(message.ProjectId, message.Path);

                _logger.LogError("Failed to generate content {ContentId}: {Error}",
                    message.ContentId, generationResult.ErrorMessage);
            }
        }
        catch (OperationCanceledException) when (cts.Token.IsCancellationRequested)
        {
            _logger.LogError("Content generation timed out for content {ContentId}", message.ContentId);
            await MarkContentAsFailedAsync(message.ContentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during content generation for content {ContentId}", message.ContentId);
            await MarkContentAsFailedAsync(message.ContentId);
        }
    }

    private async Task MarkContentAsFailedAsync(Guid contentId)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IGeneratedContentRepository>();
            var cacheService = scope.ServiceProvider.GetRequiredService<ICacheService>();

            // Update status to Failed
            await repository.UpdateStatusAndDataAsync(contentId, "Failed", "{}");

            // Get content to invalidate cache
            var content = await repository.GetByIdAsync(contentId);
            if (content != null)
            {
                await cacheService.InvalidateContentCacheAsync(content.ProjectId, content.EndpointPath);
            }

            _logger.LogInformation("Marked content {ContentId} as Failed", contentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to mark content {ContentId} as Failed", contentId);
        }
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
        base.Dispose();
    }
}
