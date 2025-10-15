using Generator.Integrations;
using Generator.Services;
using Microsoft.EntityFrameworkCore;
using Generator.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Database
var generatorConnection = builder.Configuration.GetConnectionString("GeneratorDb");
if (string.IsNullOrWhiteSpace(generatorConnection))
{
    throw new InvalidOperationException("Connection string 'GeneratorDb' not found. Ensure 'ConnectionStrings__GeneratorDb' is set.");
}

builder.Services.AddDbContext<GeneratorDbContext>(options =>
    options.UseNpgsql(generatorConnection));

builder.Services.AddOpenApi();

// Add gRPC support
builder.Services.AddGrpc();

// Configure Kestrel for gRPC
builder.WebHost.ConfigureKestrel(options =>
{
    // Setup a HTTP/2 endpoint without TLS for gRPC
    options.ListenAnyIP(8080, o => o.Protocols =
        Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http2);

    // Setup a HTTP/1.1 endpoint for REST API
    options.ListenAnyIP(80, o => o.Protocols =
        Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


// Map gRPC service
app.MapGrpcService<GeneratorServiceImpl>();

// Routes
app.MapPost("/prompt", (Delegate)OpenAIIntegration.Prompt);

app.Run();
