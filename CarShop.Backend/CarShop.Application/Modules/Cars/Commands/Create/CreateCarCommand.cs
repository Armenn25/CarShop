using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Create
{
    public sealed class CreateCarCommand : IRequest<CarDetailsDto>
    {
        public int BrandId { get; init; }
        public int CategoryId { get; init; }
        public int CarStatusId { get; init; }
        public string Model { get; init; }
        public string Vin { get; init; }
        public int ProductionYear { get; init; }
        public int Mileage { get; init; }
        public string Color { get; init; }
        public string BodyStyle { get; init; }
        public string Transmission { get; init; }
        public string FuelType { get; init; }
        public string Drivetrain { get; init; }
        public string Engine { get; init; }
        public string HorsePower { get; init; }
        public string PrimaryImageURL { get; init; }
        public string? Description { get; init; }
        public decimal Price { get; init; }
        public decimal? DiscountedPrice { get; init; }
        public DateTime? DateAdded { get; init; }
    }
}
