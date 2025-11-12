using CarShop.Application;
using Microsoft.AspNetCore.Mvc;

namespace CarShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly ICarService _svc;
    public CarsController(ICarService svc) => _svc = svc;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarDto>>> GetAll() => Ok(await _svc.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CarDto>> Get(int id)
    {
        var car = await _svc.GetByIdAsync(id);
        return car is null ? NotFound() : Ok(car);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CarCreateDto dto)
    {
        var id = await _svc.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id }, id);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CarUpdateDto dto)
        => await _svc.UpdateAsync(id, dto) ? NoContent() : NotFound();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _svc.DeleteAsync(id) ? NoContent() : NotFound();
}
