using CarShop.Application.Modules.Auth.Commands.Login;
using CarShop.Application.Modules.Auth.Dtos;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace CarShop.Tests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<Program>
{
    private static string? _cachedToken;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTests");
    }

    public async Task<HttpClient> GetAuthenticatedClientAsync()
    {
        var client = CreateClient();
        if (string.IsNullOrEmpty(_cachedToken))
        {
            var loginRequest = new
            {
                Email = "test",
                Password = "test123"
            };

            var response = await client.PostAsJsonAsync("api/auth/login", loginRequest);
            response.EnsureSuccessStatusCode();

            var loginResponse = await response.Content.ReadFromJsonAsync<AuthResultDto>();
            _cachedToken = loginResponse.AccessToken;
        }
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _cachedToken);
        return client;
    }
}