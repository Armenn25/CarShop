using CarShop.Domain.Entities.Commerc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Commerce;

public sealed class StatusEntityConfiguration : IEntityTypeConfiguration<StatusEntity>
{
    public void Configure(EntityTypeBuilder<StatusEntity> b)
    {
        b.ToTable("Statuses");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.StatusName)
            .IsUnique();

        b.Property(x => x.StatusName)
            .IsRequired()
            .HasMaxLength(100);

        b.Property(x => x.Description)
            .HasMaxLength(500);

        b.HasMany(x => x.Inquiries)
            .WithOne(x => x.Status)
            .HasForeignKey(x => x.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
