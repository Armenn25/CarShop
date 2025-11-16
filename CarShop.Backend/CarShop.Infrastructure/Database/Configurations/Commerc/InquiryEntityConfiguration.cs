using CarShop.Domain.Entities.Commerc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Database.Configurations.Commerc;

public sealed class InquiryEntityConfiguration : IEntityTypeConfiguration<InquiryEntity>
{
    public void Configure(EntityTypeBuilder<InquiryEntity> b)
    {
        b.ToTable("Inquiries");

        b.HasKey(x => x.Id);

        b.Property(x => x.Subject)
            .IsRequired()
            .HasMaxLength(200);

        b.Property(x => x.Message)
            .IsRequired()
            .HasMaxLength(2000);

        b.Property(x => x.PreferredContactMethod)
            .IsRequired()
            .HasMaxLength(50);

        b.Property(x => x.Response)
            .HasMaxLength(2000);

        b.HasOne(x => x.User)
            .WithMany(x => x.Inquiries)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.Status)
            .WithMany(x => x.Inquiries)
            .HasForeignKey(x => x.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x=>x.Car)
            .WithMany(x => x.Inquiries)
            .HasForeignKey(x => x.CarId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}