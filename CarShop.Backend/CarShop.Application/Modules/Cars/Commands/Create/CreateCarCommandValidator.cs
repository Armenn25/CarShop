using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Application.Modules.Cars.Commands.Create
{
    public sealed class CreateCarCommandValidator : AbstractValidator<CreateCarCommand>
    {
        public CreateCarCommandValidator()
        {
            RuleFor(x => x.BrandId).GreaterThan(0);
            RuleFor(x=> x.CategoryId).GreaterThan(0);
            RuleFor(x=> x.CarStatusId).GreaterThan(0);

            RuleFor(x => x.Model)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Vin)
                .NotEmpty()
                .MaximumLength(17);

            RuleFor(x=> x.Mileage)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Color)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x=> x.BodyStyle)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Transmission)
                .NotEmpty()
                .MaximumLength(50);
            
            RuleFor(x=> x.FuelType)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Drivetrain)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.Engine)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.HorsePower)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.PrimaryImageURL)
                .NotEmpty()
                .MaximumLength(500);
            
            RuleFor(x=> x.Description)
                .MaximumLength(2000);

            RuleFor(x=> x.Price)
                .GreaterThan(0);
        }
    }
}
