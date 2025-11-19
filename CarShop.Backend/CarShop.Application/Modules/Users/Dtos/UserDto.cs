namespace CarShop.Application.Modules.Users.Dtos;
public sealed class UserDto
{
    // Using 'init' instead of 'set' so properties can only be assigned during object initialization,
    // making the DTO effectively immutable and reducing the risk of accidental changes later in the code.
    public int Id { get; init; }
    public string Username { get; init; }
    public string Email { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string? Phone { get; init; }
    public string Address { get; init; }
    public int RoleId { get; init; }
    public string? RoleName { get; init; }
    public bool IsActive { get; init; }
    public DateTime RegistrationDate { get; init; }
    public DateTime? LastLoginDate { get; init; }

    // Audit fields – only for admin panel:
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? ModifiedAtUtc { get; init; }

    public static UserDto FromEntity(CarShopUserEntity user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Phone = user.Phone,
        Address = user.Address,
        RoleId = user.RoleId,
        RoleName = user.Role?.RoleName,
        IsActive = user.IsActive,
        RegistrationDate = user.RegistrationDate,
        LastLoginDate = user.LastLoginDate
    };
}
