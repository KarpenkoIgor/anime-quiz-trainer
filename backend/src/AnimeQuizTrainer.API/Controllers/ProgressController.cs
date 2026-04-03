using System.Security.Claims;
using AnimeQuizTrainer.Application.DTOs.Progress;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Прогресс пользователя по изучению опенингов.</summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgressController(IProgressService progressService) : ControllerBase
{
    /// <summary>Сводная статистика: всего изучается, сколько на повтор сегодня, сколько новых.</summary>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(UserProgressSummaryDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken ct) =>
        Ok(await progressService.GetSummaryAsync(GetUserId(), ct));

    /// <summary>Детальный прогресс по каждому опенингу.</summary>
    [HttpGet("openings")]
    [ProducesResponseType(typeof(IEnumerable<OpeningProgressDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOpeningsProgress(CancellationToken ct) =>
        Ok(await progressService.GetOpeningsProgressAsync(GetUserId(), ct));

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException());
}
