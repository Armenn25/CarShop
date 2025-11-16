using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Catalog;

public sealed class CarEntityConfiguration : IEntityTypeConfiguration<CarEntity>
{
    public void Configure(EntityTypeBuilder<CarEntity> b)
    {
        b.ToTable("Cars");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.Vin)
            .IsUnique();

        b.Property(x => x.Vin)
            .IsRequired()
            .HasMaxLength(17);

        b.Property(x => x.Model)
            .IsRequired()
            .HasMaxLength(150);

        b.Property(x => x.Color)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.BodyStyle)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.Transmission)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.FuelType)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.Drivetrain)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.Engine)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.HorsePower)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.PrimaryImageURL)
            .IsRequired()
            .HasMaxLength(500);

        b.Property(x => x.Description)
            .HasMaxLength(2000);

        b.Property(x => x.DateAdded)
            .HasDefaultValueSql("GETUTCDATE()");

        b.HasOne(x => x.Brand)
            .WithMany(x => x.Cars)
            .HasForeignKey(x => x.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.Category)
            .WithMany(x => x.Cars)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.CarStatus)
            .WithMany()
            .HasForeignKey(x => x.CarStatusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
