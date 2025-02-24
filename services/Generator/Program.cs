using Generator.Integrations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Routes
app.MapPost("/prompt", (Delegate)OpenAIIntegration.Prompt);

app.Urls.Add("http://*:80");

app.Run();
