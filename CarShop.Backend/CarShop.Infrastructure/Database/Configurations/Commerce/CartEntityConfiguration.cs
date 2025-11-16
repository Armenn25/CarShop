using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Commerce;

public sealed class CartEntityConfiguration : IEntityTypeConfiguration<CartEntity>
{
    public void Configure(EntityTypeBuilder<CartEntity> b)
    {
        b.ToTable("Carts");

        b.HasKey(x => x.Id);

        b.HasIndex(x => new { x.UserId});
        b.HasOne(x => x.User)
           .WithMany(x => x.Carts)
           .HasForeignKey(x => x.UserId)
           .OnDelete(DeleteBehavior.Restrict);

        b.HasIndex(x => new { x.CarId });
        b.HasOne(x=>x.Car)
            .WithMany(x=>x.Carts)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        b.Property(x => x.Subtotal).HasPrecision(18, 2);
        b.Property(x => x.Tax).HasPrecision(18, 2);
        b.Property(x=>x.Total).HasPrecision(18, 2).IsRequired();

    }
}
