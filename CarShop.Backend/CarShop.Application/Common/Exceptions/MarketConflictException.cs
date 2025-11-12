namespace CarShop.Application.Common.Exceptions;

public sealed class CarShopConflictException : Exception
{
    public CarShopConflictException(string message) : base(message) { }
}
