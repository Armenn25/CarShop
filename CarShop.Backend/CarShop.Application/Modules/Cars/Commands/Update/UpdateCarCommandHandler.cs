using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Update
{
    public sealed class UpdateCarCommandHandler(IAppDbContext ctx)
        : IRequestHandler<UpdateCarCommand, CarDetailsDto>
    {
        public async Task<CarDetailsDto> Handle(UpdateCarCommand request, CancellationToken ct)
        {
            var vin = request.Vin.Trim();

            var car = await ctx.Cars
                .Include(x => x.Brand)
                .Include(x => x.Category)
                .Include(x => x.CarStatus)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted, ct)
                ?? throw new CarShopNotFoundException("Vozilo nije pronađeno!");

            if (await ctx.Cars.AnyAsync(x => x.Id != request.Id && x.Vin == vin && !x.IsDeleted, ct))
                throw new CarShopConflictException("Vozilo sa istim VIN brojem već postoji!");

            var brand = await ctx.Brands.FirstOrDefaultAsync(x => x.Id == request.BrandId && !x.IsDeleted, ct)
            ?? throw new CarShopNotFoundException("Brand nije pronađen.");

            var category = await ctx.Categories.FirstOrDefaultAsync(x => x.Id == request.CategoryId && !x.IsDeleted, ct)
                ?? throw new CarShopNotFoundException("Kategorija nije pronađena.");

            var status = await ctx.Statuses.FirstOrDefaultAsync(x => x.Id == request.CarStatusId && !x.IsDeleted, ct)
                ?? throw new CarShopNotFoundException("Status nije pronađen.");

            car.BrandId = request.BrandId;
            car.CategoryId = request.CategoryId;
            car.CarStatusId = request.CarStatusId;
            car.Model = request.Model.Trim();
            car.Vin = vin;
            car.ProductionYear = request.ProductionYear;
            car.Mileage = request.Mileage;
            car.Color = request.Color.Trim();
            car.BodyStyle = request.BodyStyle.Trim();
            car.Transmission = request.Transmission.Trim();
            car.FuelType = request.FuelType.Trim();
            car.Drivetrain = request.Drivetrain.Trim();
            car.Engine = request.Engine.Trim();
            car.HorsePower = request.HorsePower.Trim();
            car.PrimaryImageURL = request.PrimaryImageURL.Trim();
            car.Description = request.Description?.Trim();
            car.Price = request.Price;
            car.DiscountedPrice = request.DiscountedPrice;
            car.DateAdded = request.DateAdded;

            await ctx.SaveChangesAsync(ct);

            car.Brand = brand;
            car.Category = category;
            car.CarStatus = status;

            return CarDetailsDto.FromEntity(car);
        }
    }
}
