using CarShop.Domain.Entities.Commerc;

namespace CarShop.Application.Abstractions;

// Application layer
public interface IAppDbContext
{

    DbSet<CarShopUserEntity> Users { get; }
    DbSet<RefreshTokenEntity> RefreshTokens { get; }
    DbSet<UserRoleEntity> UserRoles { get; }

    DbSet<BrandEntity> Brands { get; }
    DbSet<CategoryEntity> Categories { get; }
    DbSet<CarEntity> Cars { get; }

    DbSet<ReviewEntity> Reviews { get; }
    DbSet<InquiryEntity> Inquiries { get; }

    DbSet<StatusEntity> Statuses { get; }
    Task<int> SaveChangesAsync(CancellationToken ct);
}