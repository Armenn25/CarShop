using CarShop.Application.Modules.Auth.Commands.Login;
using CarShop.Application.Modules.Auth.Dtos;

public sealed class LoginCommandHandler(
    IAppDbContext ctx,
    IJwtTokenService jwt,
    IPasswordHasher<CarShopUserEntity> hasher)
    : IRequestHandler<LoginCommand, AuthResultDto>
{
    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await ctx.Users
            .Include(x=> x.Role)
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email && x.IsActive && !x.IsDeleted, ct)
            ?? throw new CarShopNotFoundException("Korisnik nije pronađen ili je onemogućen.");

        var verify = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new CarShopConflictException("Pogrešni kredencijali.");

        if (user.Role is null)
            throw new CarShopNotFoundException("Korisnička uloga nije pronađena.");

        var tokens = jwt.IssueTokens(user, user.Role.RoleName);

        ctx.RefreshTokens.Add(new RefreshTokenEntity
        {
            TokenHash = tokens.RefreshTokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            UserId = user.Id,
            Fingerprint = request.Fingerprint
        });

        await ctx.SaveChangesAsync(ct);

      
        return new AuthResultDto
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshTokenRaw,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,

            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,

            RoleId = user.RoleId,
            RoleName = user.Role.RoleName
        };
    }
}
