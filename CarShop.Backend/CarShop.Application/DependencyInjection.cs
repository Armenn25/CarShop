using Microsoft.Extensions.DependencyInjection;

namespace CarShop.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        
        return services;
    }
}


public interface ICarService
{
    Task<IEnumerable<CarDto>> GetAllAsync();
    Task<CarDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CarCreateDto dto);
    Task<bool> UpdateAsync(int id, CarUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}

public record CarDto(int Id, string Brand, string Model, int Year, decimal Price);
public record CarCreateDto(string Brand, string Model, int Year, decimal Price);
public record CarUpdateDto(string Brand, string Model, int Year, decimal Price);
