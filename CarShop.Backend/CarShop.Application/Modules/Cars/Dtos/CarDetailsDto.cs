using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Dtos
{
    public sealed class CarDetailsDto
    {
        public int Id { get; init; }
        public int BrandId { get; init; }
        public string BrandName { get; init; } = string.Empty;
        public int CategoryId { get; init; }
        public string CategoryName { get; init; } = string.Empty;
        public int CarStatusId { get; init; }
        public string CarStatusName { get; init; } = string.Empty;
        public string Model { get; init; } = string.Empty;
        public string Vin { get; init; } = string.Empty;
        public int ProductionYear { get; init; }
        public int Mileage { get; init; }
        public string Color { get; init; } = string.Empty;
        public string BodyStyle { get; init; } = string.Empty;
        public string Transmission { get; init; } = string.Empty;
        public string FuelType { get; init; } = string.Empty;
        public string Drivetrain { get; init; } = string.Empty;
        public string Engine { get; init; } = string.Empty;
        public string HorsePower { get; init; } = string.Empty;
        public string PrimaryImageURL { get; init; } = string.Empty;
        public string? Description { get; init; }
        public decimal Price { get; init; }
        public decimal? DiscountedPrice { get; init; }
        public DateTime DateAdded { get; init; }
        public DateTime CreatedAtUtc { get; init; }
        public DateTime? ModifiedAtUtc { get; init; }

        public static CarDetailsDto FromEntity(CarEntity car) => new()
        {
            Id = car.Id,
            BrandId = car.BrandId,
            BrandName = car.Brand?.BrandName ?? string.Empty,
            CategoryId = car.CategoryId,
            CategoryName = car.Category?.CategoryName ?? string.Empty,
            CarStatusId = car.CarStatusId,
            CarStatusName = car.CarStatus?.StatusName ?? string.Empty,
            Model = car.Model,
            Vin = car.Vin,
            ProductionYear = car.ProductionYear,
            Mileage = car.Mileage,
            Color = car.Color,
            BodyStyle = car.BodyStyle,
            Transmission = car.Transmission,
            FuelType = car.FuelType,
            Drivetrain = car.Drivetrain,
            Engine = car.Engine,
            HorsePower = car.HorsePower,
            PrimaryImageURL = car.PrimaryImageURL,
            Description = car.Description,
            Price = car.Price,
            DiscountedPrice = car.DiscountedPrice,
            DateAdded = car.DateAdded,
            CreatedAtUtc = car.CreatedAtUtc,
            ModifiedAtUtc = car.ModifiedAtUtc
        };
    }
}
