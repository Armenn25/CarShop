using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Queries.GetCars
{
    public sealed class GetCarsQuery : BasePagedQuery<CarDto>
    {
        public string? Make { get; init; }
        public string? Model { get; init; }
        public int? Year { get; init; }
    }
}
