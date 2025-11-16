using CarShop.Domain.Entities.Commerc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Commerc;

public sealed class ReviewEntityConfiguration :IEntityTypeConfiguration<ReviewEntity>
{
    public void Configure(EntityTypeBuilder<ReviewEntity> b)
    {
        b.ToTable("Reviews");

        b.HasKey(x => x.Id);

        b.Property(x => x.Rating)
            .IsRequired();

        b.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.Content)
            .IsRequired()
            .HasMaxLength(500);

        b.Property(x => x.RewievDate)
            .HasDefaultValueSql("GETUTCDATE()");

        b.Property(x => x.IsApproved)
            .HasDefaultValue(false);

        b.HasOne(x => x.User)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.Car)
            .WithMany()
            .HasForeignKey(x => x.CarId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
