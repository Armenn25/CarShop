namespace CarShop.Application.Common.Exceptions;

public sealed class CarShopNotFoundException : Exception
{
    public CarShopNotFoundException(string message) : base(message) { }
}
