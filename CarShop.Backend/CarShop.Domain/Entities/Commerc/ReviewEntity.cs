using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CarShop.Domain.Common;
using CarShop.Domain.Entities.Catalog;
using CarShop.Domain.Entities.Identity;

namespace CarShop.Domain.Entities.Commerc;

public sealed class ReviewEntity : BaseEntity
{
    public int UserId { get; set; }
    public CarShopUserEntity User { get; set; } = default!;

    public int CarId { get; set; }
    public CarEntity Car { get; set; } = default!;

    public int Rating { get; set; }=default!;
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime RewievDate { get; set; }
    public bool IsApproved { get; set; }
}
