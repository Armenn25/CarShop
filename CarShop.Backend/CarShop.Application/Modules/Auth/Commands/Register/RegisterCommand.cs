using CarShop.Application.Modules.Auth.Dtos;

namespace CarShop.Application.Modules.Auth.Commands.Register;

public sealed class RegisterCommand :IRequest<AuthResultDto>
{
    public string Username { get; init; }
    public string Email { get; init; }
    public string Password { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string? Phone { get; init; }
    public string Address { get; init; }
    public string? Fingerprint { get; init; }
}
