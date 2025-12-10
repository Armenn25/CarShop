using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Delete
{
    public sealed class DeleteCarCommandValidator : AbstractValidator<DeleteCarCommand>
    {
        public DeleteCarCommandValidator() 
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);
        }
    }
}
