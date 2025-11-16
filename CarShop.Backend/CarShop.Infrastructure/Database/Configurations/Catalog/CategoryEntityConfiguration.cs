using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Catalog;

public sealed class CategoryEntityConfiguration :IEntityTypeConfiguration<CategoryEntity>
{
    public void Configure(EntityTypeBuilder<CategoryEntity> b)
    {
        b.ToTable("Categories");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.CategoryName)
            .IsUnique();

        b.Property(x => x.CategoryName)
            .IsRequired()
            .HasMaxLength(100);

        b.HasMany(x => x.Cars)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
