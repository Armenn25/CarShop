using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CarShop.Domain.Common;
using CarShop.Domain.Entities.Identity;
using CarShop.Domain.Entities.Catalog;


namespace CarShop.Domain.Entities.Commerc;
public sealed class InquiryEntity : BaseEntity
{
    public int UserId { get; set; }
    public CarShopUserEntity User { get; set; } = default!;

    public int CarId { get; set; }
    public CarEntity Car { get; set; }=default!;

    public string Subject { get; set; } = default!;
    public string Message { get; set; } = default!;
    public string PreferredContactMethod { get; set; } = default!;
    public int StatusId { get; set; }
    public StatusEntity Status { get; set; } = default!;
    public DateTime? RespondedAtUtc { get; set; }
    public string? Response { get; set; }

}

