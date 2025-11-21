using CarShop.Application.Modules.Auth.Commands.Login;
using CarShop.Application.Modules.Auth.Commands.Logout;
using CarShop.Application.Modules.Auth.Commands.Refresh;
using CarShop.Application.Modules.Auth.Commands.Register;
using CarShop.Application.Modules.Auth.Dtos;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResultDto>> Login([FromBody] LoginCommand command, CancellationToken ct)
    {
        return Ok(await mediator.Send(command, ct));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResultDto>> Register([FromBody] RegisterCommand command, CancellationToken ct)
    {
        return Ok(await mediator.Send(command, ct));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResultDto>> Refresh([FromBody] RefreshTokenCommand command, CancellationToken ct)
    {
        return Ok(await mediator.Send(command, ct));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task Logout([FromBody] LogoutCommand command, CancellationToken ct)
    {
        await mediator.Send(command, ct);
    }
}