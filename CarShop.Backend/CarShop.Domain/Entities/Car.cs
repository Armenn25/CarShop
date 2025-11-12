namespace CarShop.Domain.Entities;

public class Car
{
    public int Id { get; set; }
    public string Brand { get; set; } = default!;
    public string Model { get; set; } = default!;
    public int Year { get; set; }
    public decimal Price { get; set; }
}
