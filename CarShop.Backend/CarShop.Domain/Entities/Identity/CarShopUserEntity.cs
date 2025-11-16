// CarShopUserEntity.cs
using CarShop.Domain.Common;
using CarShop.Domain.Entities.Commerc;

namespace CarShop.Domain.Entities.Identity;

public sealed class CarShopUserEntity : BaseEntity
{
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Phone { get; set; }
    public string Address { get; set; } = default;
    public DateTime RegistrationDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public int RoleId { get; set; }
    public UserRoleEntity Role { get; set; } = default;
    public bool IsActive { get; set; }
    public ICollection<RefreshTokenEntity> RefreshTokens { get; private set; } = new List<RefreshTokenEntity>();
    public ICollection<ReviewEntity>Reviews { get; private set; }=new List<ReviewEntity>();
    public ICollection<InquiryEntity> Inquiries { get; private set; }=new List<InquiryEntity>();
}