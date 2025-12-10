using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Dtos
{
    public sealed class CarDto
    {
        public int Id { get; init; }
        public string Make { get; init; } = string.Empty;
        public string Model { get; init; } = string.Empty;
        public int Year { get; init; }
        public decimal Price { get; init; }
        public decimal? DiscountedPrice { get; init; }
        public int Mileage { get; init; }
        public string BodyStyle { get; init; } = string.Empty;
        public string Transmission { get; init; } = string.Empty;
        public string FuelType { get; init; } = string.Empty;
    }
}
