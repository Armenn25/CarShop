
using CarShop.Application.Modules.Auth.Dtos;

namespace CarShop.Application.Modules.Auth.Queries.CheckEmailAvailability;

public sealed class CheckEmailAvailabilityQueryHandler:IRequestHandler<CheckEmailAvailabilityQuery,AvailabilityDto>
{
    private readonly IAppDbContext _ctx;

    public CheckEmailAvailabilityQueryHandler(IAppDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<AvailabilityDto> Handle(CheckEmailAvailabilityQuery request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return new AvailabilityDto { Available = false };
        }

        var normalized = request.Email.Trim().ToLowerInvariant();

        var exists = await _ctx.Users.AsNoTracking().AnyAsync(u => u.Email.ToLower() == normalized && !u.IsDeleted, ct);

        return new AvailabilityDto { Available = !exists };
    }
}
