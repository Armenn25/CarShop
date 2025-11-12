using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace CarShop.Infrastructure.Common;

public class CarShopExceptionHandler : IExceptionHandler
{
    private readonly ILogger<CarShopExceptionHandler> _logger;

    public CarShopExceptionHandler(ILogger<CarShopExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        var problem = new ProblemDetails
        {
            Title = "An unexpected error occurred",
            Detail = exception.Message,
            Status = StatusCodes.Status500InternalServerError
        };

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken: cancellationToken);

        return true;
    }
}
