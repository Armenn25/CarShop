using CarShop.Application.Modules.Cars.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Queries.GetCarById
{
    public sealed class GetCarByIdQuery : IRequest <CarDetailsDto>
    {
        public int Id { get; init; }
    }
}
