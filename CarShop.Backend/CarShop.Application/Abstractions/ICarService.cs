namespace CarShop.Application.Abstractions;

public interface ICarService
{
    Task<IEnumerable<CarDto>> GetAllAsync();
    Task<CarDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CarCreateDto dto);
    Task<bool> UpdateAsync(int id, CarUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
