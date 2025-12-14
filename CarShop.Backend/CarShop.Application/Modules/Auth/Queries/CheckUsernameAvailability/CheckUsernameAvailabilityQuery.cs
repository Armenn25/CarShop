using CarShop.Application.Modules.Auth.Dtos;
using MediatR;

namespace CarShop.Application.Modules.Auth.Queries.CheckUsernameAvailability;

public sealed record CheckUsernameAvailabilityQuery(string Username)
    : IRequest<AvailabilityDto>;
