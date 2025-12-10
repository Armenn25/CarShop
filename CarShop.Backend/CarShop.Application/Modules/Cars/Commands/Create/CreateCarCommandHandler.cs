using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Create
{
    public sealed class CreateCarCommandHandler(IAppDbContext ctx, TimeProvider clock)
        :IRequestHandler<CreateCarCommand, CarDetailsDto>
    {
        public async Task<CarDetailsDto> Handle(CreateCarCommand request, CancellationToken ct)
        {
            var vin = request.Vin.Trim();
            if (await ctx.Cars.AnyAsync(x => x.Vin == vin && !x.IsDeleted, ct))
                throw new CarShopConflictException("Vozilo s istim VIN brojem već postoji!");

            var brand = await ctx.Brands.FirstOrDefaultAsync(x => x.Id == request.BrandId && !x.IsDeleted, ct)
                ?? throw new CarShopConflictException("Brand nije pronađen!");

            var category = await ctx.Categories.FirstOrDefaultAsync(x => x.Id == request.CategoryId && !x.IsDeleted, ct)
                ?? throw new CarShopConflictException("Kategorija nije pronađena!");

            var status = await ctx.Statuses.FirstOrDefaultAsync(x => x.Id == request.CarStatusId && !x.IsDeleted, ct)
                ?? throw new CarShopConflictException("Status nije pronađen.");

            var car = new CarEntity
            {
                BrandId = request.BrandId,
                CategoryId = request.CategoryId,
                CarStatusId = request.CarStatusId,
                Model = request.Model.Trim(),
                Vin = vin,
                ProductionYear = request.ProductionYear,
                Mileage = request.Mileage,
                Color = request.Color.Trim(),
                BodyStyle = request.BodyStyle.Trim(),
                Transmission = request.Transmission.Trim(),
                FuelType = request.FuelType.Trim(),
                Drivetrain = request.Drivetrain.Trim(),
                Engine = request.Engine.Trim(),
                HorsePower = request.HorsePower.Trim(),
                PrimaryImageURL = request.PrimaryImageURL.Trim(),
                Description = request.Description?.Trim(),
                Price = request.Price,
                DiscountedPrice = request.DiscountedPrice,
                DateAdded = request.DateAdded ?? clock.GetUtcNow().UtcDateTime
            };
            
            ctx.Cars.Add(car);
            await ctx.SaveChangesAsync(ct);

            car.Brand = brand;
            car.Category = category;
            car.CarStatus = status;

            return CarDetailsDto.FromEntity(car);
        }
    }
}
