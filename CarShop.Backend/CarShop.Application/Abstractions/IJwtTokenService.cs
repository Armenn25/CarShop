namespace CarShop.Application.Abstractions;

public interface IJwtTokenService
{
    JwtTokenPair IssueTokens(CarUserEntity user);
    string HashRefreshToken(string rawToken);
}
