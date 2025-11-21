namespace CarShop.Application.Modules.Auth.Dtos;

public sealed class AuthResultDto
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
