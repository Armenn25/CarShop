namespace CarShop.Infrastructure.Database.Configurations.Identity;

public sealed class UserEntityConfiguration : IEntityTypeConfiguration<CarShopUserEntity>
{
    public void Configure(EntityTypeBuilder<CarShopUserEntity> b)
    {
        b.ToTable("Users");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.Email).IsUnique();
        b.Property(x => x.Email).IsRequired().HasMaxLength(200);

        b.HasIndex(x=>x.Username).IsUnique();
        b.Property(x=>x.Username).IsRequired().HasMaxLength(50);
        
        b.Property(x => x.PasswordHash).IsRequired();

        b.Property(x=>x.FirstName).IsRequired().HasMaxLength(50);

        b.Property(x => x.LastName).IsRequired().HasMaxLength(50);

        b.Property(x=>x.Phone).HasMaxLength(50);

        b.Property(x=>x.Address).IsRequired().HasMaxLength(50);

        b.Property(x => x.RoleId).IsRequired();

        b.HasOne(x => x.Role)
           .WithMany(x => x.Users)
           .HasForeignKey(x => x.RoleId)
           .OnDelete(DeleteBehavior.Restrict);

        b.Property(x => x.IsActive).HasDefaultValue(true);

        b.Property(x => x.CreatedAtUtc).HasDefaultValueSql("GETUTCDATE()");

        // Navigation
        b.HasMany(x => x.RefreshTokens)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId);
    }
}