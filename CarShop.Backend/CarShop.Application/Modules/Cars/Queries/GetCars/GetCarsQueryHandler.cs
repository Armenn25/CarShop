using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Queries.GetCars
{
    public sealed class GetCarsQueryHandler(IAppDbContext ctx)
    : IRequestHandler<GetCarsQuery, PageResult<CarDto>>
    {
        public async Task<PageResult<CarDto>> Handle(GetCarsQuery request, CancellationToken ct)
        {
            var query = ctx.Cars
                .AsNoTracking()
                .Include(x => x.Brand)
                .Where(x => !x.IsDeleted && x.Brand != null);

            if (!string.IsNullOrWhiteSpace(request.Make))
            {
                var make = request.Make.Trim().ToLower();
                query = query.Where(x => x.Brand!.BrandName.ToLower().Contains(make));
            }

            if (!string.IsNullOrWhiteSpace(request.Model))
            {
                var model = request.Model.Trim().ToLower();
                query = query.Where(x => x.Model.ToLower().Contains(model));
            }

            if (request.Year.HasValue)
            {
                query = query.Where(x => x.ProductionYear == request.Year.Value);
            }

            query = query
                .OrderBy(x => x.Brand!.BrandName)
                .ThenBy(x => x.Model);

            var dtoQuery = query.Select(x => new CarDto
            {
                Id = x.Id,
                Make = x.Brand!.BrandName,
                Model = x.Model,
                Year = x.ProductionYear,
                Price = x.Price,
                DiscountedPrice = x.DiscountedPrice,
                Mileage = x.Mileage,
                BodyStyle = x.BodyStyle,
                Transmission = x.Transmission,
                FuelType = x.FuelType
            });

            return await PageResult<CarDto>.FromQueryableAsync(dtoQuery, request.Paging, ct);
        }
    }
}
