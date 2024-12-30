using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add Ocelot
builder.Services.AddOcelot();

// Add configuration from ocelot.json
builder.Configuration.AddJsonFile("ocelot.json");

var app = builder.Build();

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
