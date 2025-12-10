using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Delete
{
    public sealed class DeleteCarCommandHandler(IAppDbContext ctx) : IRequestHandler<DeleteCarCommand>
    {
        public async Task Handle(DeleteCarCommand request, CancellationToken ct)
        {
            var car = await ctx.Cars.FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted, ct)
                ?? throw new CarShopNotFoundException("Vozilo nije pronađeno!");

            ctx.Cars.Remove(car);
            await ctx.SaveChangesAsync(ct);
        }
    }
}
