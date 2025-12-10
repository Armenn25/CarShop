using CarShop.Application.Modules.Users.Dtos;

namespace CarShop.Application.Modules.Users.Commands.Create;

public sealed class CreateUserCommandHandler(IAppDbContext ctx,IPasswordHasher<CarShopUserEntity> hasher,TimeProvider clock) :
    IRequestHandler<CreateUserCommand, UserDto>
{
    public async Task<UserDto>Handle(CreateUserCommand request,CancellationToken ct)
    {
        
        var email = request.Email.Trim().ToLowerInvariant();
        var username = request.Username.Trim();

        //Here we check if the email already exists in database
        if (await ctx.Users.AnyAsync(x => x.Email.ToLower() == email && !x.IsDeleted, ct))
            throw new CarShopConflictException("Email je vec registrovan");

        //Here we check if the username already exists
        if (await ctx.Users.AnyAsync(x => x.Username == username && !x.IsDeleted, ct))
            throw new CarShopConflictException("Username je vec zauzet");

        //Here we check if the role is valid, if it exists!
        var role = await ctx.UserRoles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.RoleId && !x.IsDeleted, ct) ??
            throw new CarShopNotFoundException("Uloga nije pronadjena");

        var user = new CarShopUserEntity
        {
            Username = username,
            Email = email,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Phone = request.Phone?.Trim(),
            Address = request.Address.Trim(),
            RoleId = request.RoleId,
            RegistrationDate = clock.GetUtcNow().UtcDateTime,
            IsActive = request.IsActive
        };

        user.PasswordHash = hasher.HashPassword(user, request.Password);

        ctx.Users.Add(user);
        await ctx.SaveChangesAsync(ct);

        user.Role = role;
        return UserDto.FromEntity(user);
    }
}