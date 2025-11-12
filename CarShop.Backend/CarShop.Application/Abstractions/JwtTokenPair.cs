namespace CarShop.Application.Abstractions;

public class JwtTokenPair
{
    public string AccessToken { get; set; } = default!;
    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public string RefreshTokenRaw { get; set; } = default!;
    public string RefreshTokenHash { get; set; } = default!;
    public DateTime RefreshTokenExpiresAtUtc { get; set; }
}
