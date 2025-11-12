using CarShop.Application;
using CarShop.Domain;
using Microsoft.EntityFrameworkCore;

namespace CarShop.Infrastructure;

internal class EfCarService : ICarService
{
    private readonly ApplicationDbContext _db;
    public EfCarService(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<CarDto>> GetAllAsync()
        => await _db.Cars.AsNoTracking()
            .Select(c => new CarDto(c.Id, c.Brand, c.Model, c.Year, c.Price))
            .ToListAsync();

    public async Task<CarDto?> GetByIdAsync(int id)
        => await _db.Cars.AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CarDto(c.Id, c.Brand, c.Model, c.Year, c.Price))
            .FirstOrDefaultAsync();

    public async Task<int> CreateAsync(CarCreateDto dto)
    {
        var car = new Car { Brand = dto.Brand, Model = dto.Model, Year = dto.Year, Price = dto.Price };
        _db.Cars.Add(car);
        await _db.SaveChangesAsync();
        return car.Id;
    }

    public async Task<bool> UpdateAsync(int id, CarUpdateDto dto)
    {
        var car = await _db.Cars.FindAsync(id);
        if (car is null) return false;
        car.Brand = dto.Brand; car.Model = dto.Model; car.Year = dto.Year; car.Price = dto.Price;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var car = await _db.Cars.FindAsync(id);
        if (car is null) return false;
        _db.Cars.Remove(car);
        await _db.SaveChangesAsync();
        return true;
    }
}
