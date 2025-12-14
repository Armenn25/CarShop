using CarShop.Application.Modules.Auth.Dtos;

namespace CarShop.Application.Modules.Auth.Queries.CheckUsernameAvailability;

public sealed class CheckUsernameAvailabilityQueryHandler
    : IRequestHandler<CheckUsernameAvailabilityQuery, AvailabilityDto>
{
    private readonly IAppDbContext _ctx;

    public CheckUsernameAvailabilityQueryHandler(IAppDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<AvailabilityDto> Handle(
        CheckUsernameAvailabilityQuery request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return new AvailabilityDto { Available = false };
        }

        var normalized = request.Username.Trim();

        var exists = await _ctx.Users
            .AsNoTracking()
            .AnyAsync(u => u.Username == normalized && !u.IsDeleted, ct);

        return new AvailabilityDto { Available = !exists };
    }
}
