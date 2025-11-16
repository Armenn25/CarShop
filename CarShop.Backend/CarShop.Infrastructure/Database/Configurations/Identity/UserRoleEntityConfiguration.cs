using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Identity;

public sealed class UserRoleEntityConfiguration : IEntityTypeConfiguration<UserRoleEntity>
{
    public void Configure(EntityTypeBuilder<UserRoleEntity> b)
    {
        b.ToTable("UserRoles");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.RoleName)
            .IsUnique();

        b.Property(x => x.RoleName)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.RoleDescription)
            .HasMaxLength(200);

        b.HasMany(x => x.Users)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}