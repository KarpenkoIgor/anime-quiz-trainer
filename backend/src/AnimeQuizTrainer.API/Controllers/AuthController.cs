using AnimeQuizTrainer.Application.DTOs.Auth;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Регистрация, вход и управление токенами.</summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Регистрация нового пользователя.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await authService.RegisterAsync(request, ct);
        return Created(string.Empty, result);
    }

    /// <summary>Вход по email и паролю.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request, ct);
        return Ok(result);
    }

    /// <summary>Обновление access-токена по refresh-токену.</summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await authService.RefreshAsync(request.RefreshToken, ct);
        return Ok(result);
    }

    /// <summary>Выход — отзыв refresh-токена.</summary>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        await authService.LogoutAsync(request.RefreshToken, ct);
        return NoContent();
    }
}
