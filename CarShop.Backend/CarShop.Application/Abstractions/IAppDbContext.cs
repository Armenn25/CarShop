namespace CarShop.Application.Abstractions;

// Application layer
public interface IAppDbContext
{
    DbSet<ProductEntity> Products { get; }
    DbSet<ProductCategoryEntity> ProductCategories { get; }
    DbSet<CarShopUserEntity> Users { get; }
    DbSet<RefreshTokenEntity> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken ct);
}