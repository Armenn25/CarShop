using CarShop.Application.Modules.Cars.Commands.Create;
using CarShop.Application.Modules.Cars.Commands.Delete;
using CarShop.Application.Modules.Cars.Commands.Update;
using CarShop.Application.Modules.Cars.Dtos;
using CarShop.Application.Modules.Cars.Queries.GetCarById;
using CarShop.Application.Modules.Cars.Queries.GetCars;

[ApiController]
[Route("api/cars")]
public sealed class CarsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PageResult<CarDto>>> Get([FromQuery] GetCarsQuery query, CancellationToken ct)
    {
        var result = await mediator.Send(query, ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CarDetailsDto>> GetById(int id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetCarByIdQuery { Id = id }, ct);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CarDetailsDto>> Create([FromBody] CreateCarCommand command, CancellationToken ct)
    {
        var created = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<CarDetailsDto>> Update(int id, [FromBody] UpdateCarCommand command, CancellationToken ct)
    {
        command.Id = id;
        var updated = await mediator.Send(command, ct);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await mediator.Send(new DeleteCarCommand { Id = id }, ct);
        return NoContent();
    }
}