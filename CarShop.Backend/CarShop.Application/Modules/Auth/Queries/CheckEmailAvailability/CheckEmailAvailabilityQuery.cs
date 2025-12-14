using CarShop.Application.Modules.Auth.Dtos;
using MediatR;

namespace CarShop.Application.Modules.Auth.Queries.CheckEmailAvailability;

public sealed record CheckEmailAvailabilityQuery(string Email)
    : IRequest<AvailabilityDto>;
