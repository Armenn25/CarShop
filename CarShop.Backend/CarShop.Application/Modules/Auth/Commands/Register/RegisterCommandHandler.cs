using CarShop.Application.Modules.Auth.Dtos;

namespace CarShop.Application.Modules.Auth.Commands.Register;

public sealed class RegisterCommandHandler(IAppDbContext ctx,IPasswordHasher<CarShopUserEntity> hasher,IJwtTokenService jwt,TimeProvider clock) : 
    IRequestHandler<RegisterCommand,AuthResultDto>
{
    public async Task<AuthResultDto> Handle(RegisterCommand request,CancellationToken ct)
    {
        var email=request.Email.Trim().ToLowerInvariant();
        var username = request.Username.Trim();

        if (await ctx.Users.AnyAsync(x => x.Username == username && !x.IsDeleted, ct))
            throw new CarShopConflictException("Email je vec zauzet");

        if(await ctx.Users.AnyAsync(x=>x.Email.ToLower() == email && !x.IsDeleted,ct))
            throw new CarShopConflictException("Email je vec zauzet");

        var customerRole = await ctx.UserRoles.AsNoTracking().FirstOrDefaultAsync(x => x.RoleName == "Customer" && !x.IsDeleted, ct) ??
            throw new CarShopNotFoundException("Korisnicka uloga nije pronadjena");

        var now = clock.GetUtcNow().UtcDateTime;

        var user = new CarShopUserEntity
        {
            Username = username,
            Email = email,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Phone = request.Phone?.Trim(),
            Address = request.Address.Trim(),
            RoleId = customerRole.Id,
            IsActive = true,
            RegistrationDate = now,
            CreatedAtUtc = now
        };

        user.PasswordHash = hasher.HashPassword(user, request.Password);

        var tokens=jwt.IssueTokens(user);

        ctx.Users.Add(user);
        ctx.RefreshTokens.Add(new RefreshTokenEntity
        {
            TokenHash = tokens.RefreshTokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            User = user,
            Fingerprint = request.Fingerprint
        });

        await ctx.SaveChangesAsync(ct);

        return new AuthResultDto
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshTokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
    }
}
