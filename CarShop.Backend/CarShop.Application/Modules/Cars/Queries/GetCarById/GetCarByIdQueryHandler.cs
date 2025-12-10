using CarShop.Application.Modules.Cars.Dtos;

namespace CarShop.Application.Modules.Cars.Queries.GetCarById;

public sealed class GetCarByIdQueryHandler(IAppDbContext ctx)
    : IRequestHandler<GetCarByIdQuery, CarDetailsDto>
{
    public async Task<CarDetailsDto> Handle(GetCarByIdQuery request, CancellationToken ct)
    {
        var car = await ctx.Cars
            .AsNoTracking()
            .Include(x => x.Brand)
            .Include(x => x.Category)
            .Include(x => x.CarStatus)
            .FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted, ct)
            ?? throw new CarShopNotFoundException("Vozilo nije pronađeno.");

        return CarDetailsDto.FromEntity(car);
    }
}