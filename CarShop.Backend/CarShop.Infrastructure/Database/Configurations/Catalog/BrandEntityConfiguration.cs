using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Catalog;

public sealed class BrandEntityConfiguration : IEntityTypeConfiguration<BrandEntity>
{
    public void Configure(EntityTypeBuilder<BrandEntity> b)
    {
        b.ToTable("Brands");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.BrandName)
            .IsUnique();

        b.Property(x => x.BrandName)
            .IsRequired()
            .HasMaxLength(100);

        b.HasMany(x => x.Cars)
            .WithOne(x => x.Brand)
            .HasForeignKey(x => x.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
