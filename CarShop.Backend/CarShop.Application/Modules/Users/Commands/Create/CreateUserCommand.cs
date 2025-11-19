using CarShop.Application.Modules.Users.Dtos;

namespace CarShop.Application.Modules.Users.Commands.Create;
public sealed class CreateUserCommand : IRequest<UserDto>
{
    public string Username { get; init; }
    public string Email { get; init; }
    public string Password { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string? Phone { get; init; }
    public string Address { get; init; }
    public int RoleId { get; init; }
    public bool IsActive { get; init; } = true;
}
