using CarShop.Application.Abstractions;
using CarShop.Domain.Entities.Commerc;

namespace CarShop.Infrastructure.Database;

public partial class DatabaseContext : DbContext, IAppDbContext
{
    public DbSet<CarShopUserEntity> Users => Set<CarShopUserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();
    public DbSet<UserRoleEntity> UserRoles => Set<UserRoleEntity>();

    public DbSet<BrandEntity> Brands => Set<BrandEntity>();
    public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();
    public DbSet<CarEntity> Cars => Set<CarEntity>();

    public DbSet<ReviewEntity> Reviews => Set<ReviewEntity>();
    public DbSet<InquiryEntity> Inquiries => Set<InquiryEntity>();

    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();

    private readonly TimeProvider _clock;
    public DatabaseContext(DbContextOptions<DatabaseContext> options, TimeProvider clock) : base(options)
    {
        _clock = clock;
    }
}