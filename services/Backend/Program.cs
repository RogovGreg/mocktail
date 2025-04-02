using Grpc.Net.Client;
using Content.Protos;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure gRPC client
builder.Services.AddGrpcClient<ContentService.ContentServiceClient>(options =>
{
    options.Address = new Uri("http://content:8080"); // Docker service name and gRPC port
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/check-availability", () =>
{
    return Results.Json(new
    {
        service = "Backend",
        timestamp = DateTime.UtcNow.ToString("o")
    });
});

// Example endpoint using the gRPC client
app.MapGet("/content/{userId}", async (string userId, ContentService.ContentServiceClient client) =>
{
    var request = new ListContentRequest { UserId = userId };
    var response = await client.ListContentAsync(request);
    return Results.Ok(response.Items);
});

app.MapPost("/content", async (CreateContentRequest request, ContentService.ContentServiceClient client) =>
{
    var response = await client.CreateContentAsync(request);
    return Results.Ok(response.Item);
});

app.MapGet("/", () => "`Backend` service is alive");

app.Urls.Add("http://*:80");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
