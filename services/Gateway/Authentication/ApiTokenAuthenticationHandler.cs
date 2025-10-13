using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Gateway.Authentication;

public class ApiTokenAuthenticationSchemeOptions : AuthenticationSchemeOptions { }

public class ApiTokenAuthenticationHandler : AuthenticationHandler<ApiTokenAuthenticationSchemeOptions>
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ApiTokenAuthenticationHandler> _logger;

    public ApiTokenAuthenticationHandler(
        IOptionsMonitor<ApiTokenAuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IHttpClientFactory httpClientFactory)
        : base(options, logger, encoder)
    {
        // Use named client configured in Program.cs with base address http://auth:80
        _httpClient = httpClientFactory.CreateClient("AuthService");
        _logger = logger.CreateLogger<ApiTokenAuthenticationHandler>();
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        try
        {
            // Get the Authorization header
            if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                return AuthenticateResult.NoResult();
            }

            var authHeaderValue = AuthenticationHeaderValue.Parse(authHeader.ToString());
            if (authHeaderValue.Scheme != "Bearer")
            {
                return AuthenticateResult.NoResult();
            }

            var token = authHeaderValue.Parameter;
            if (string.IsNullOrEmpty(token))
            {
                return AuthenticateResult.Fail("Token is missing");
            }

            // Validate token with Auth service
            var validationResult = await ValidateTokenWithAuthService(token);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("API token validation failed: {Error}", validationResult.ErrorMessage);
                return AuthenticateResult.Fail(validationResult.ErrorMessage ?? "Invalid token");
            }

            // Create claims identity
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, validationResult.UserId!),
                new Claim("sub", validationResult.UserId!),
                new Claim("project_id", validationResult.ProjectId.ToString()!),
                new Claim("type", "api_token")
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during API token authentication");
            return AuthenticateResult.Fail("Authentication error");
        }
    }

    private async Task<ApiTokenValidationResult> ValidateTokenWithAuthService(string token)
    {
        try
        {
            // Create a request to validate the token
            var request = new HttpRequestMessage(HttpMethod.Post, "/api-tokens/validate");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                return new ApiTokenValidationResult(false, null, null, "Token validation failed");
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = System.Text.Json.JsonSerializer.Deserialize<ApiTokenValidationResponse>(content, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null)
            {
                return new ApiTokenValidationResult(false, null, null, "Invalid response from auth service");
            }

            return new ApiTokenValidationResult(
                result.IsValid,
                result.UserId,
                result.ProjectId,
                result.ErrorMessage
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling auth service for token validation");
            return new ApiTokenValidationResult(false, null, null, "Token validation service error");
        }
    }

    private record ApiTokenValidationResponse(bool IsValid, string? UserId, Guid? ProjectId, string? ErrorMessage);
    private record ApiTokenValidationResult(bool IsValid, string? UserId, Guid? ProjectId, string? ErrorMessage);
}
