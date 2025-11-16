using CarShop.Domain.Common;
using CarShop.Domain.Entities.Commerc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Domain.Entities.Catalog;

public sealed class CarEntity : BaseEntity
{
    public int BrandId { get; set; }
    public BrandEntity Brand { get; set; } = default!;

    public int CategoryId { get; set; }
    public CategoryEntity Category { get; set; }=default!;

    public int CarStatusId { get; set; }
    public StatusEntity CarStatus { get; set; }=default!;

    public string Model { get; set; } = default!;
    public string Vin { get; set; } = default!;
    public int ProductionYear { get; set; }
    public int Mileage { get; set; }
    public string Color { get; set; } = default!;
    public string BodyStyle { get; set; } = default!;
    public string Transmission { get; set; } = default!;
    public string FuelType { get; set; } = default!;
    public string Drivetrain { get; set; } = default!;
    public string Engine { get; set; } = default!;
    public string HorsePower { get; set; } = default!;
    public string PrimaryImageURL { get; set; } = default!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public DateTime DateAdded { get; set; }

    public ICollection<InquiryEntity> Inquiries {  get; private set; }=new List<InquiryEntity>();
}
