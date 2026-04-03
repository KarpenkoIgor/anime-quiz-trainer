using AnimeQuizTrainer.Application.DTOs.Opening;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Управление опенингами.</summary>
[ApiController]
[Route("api/[controller]")]
public class OpeningController(IOpeningService openingService) : ControllerBase
{
    /// <summary>Получить все опенинги.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<OpeningDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await openingService.GetAllAsync(ct));

    /// <summary>Получить опенинг по ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OpeningDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct) =>
        Ok(await openingService.GetByIdAsync(id, ct));

    /// <summary>Получить все опенинги конкретного аниме.</summary>
    [HttpGet("by-anime/{animeId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<OpeningDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByAnime(Guid animeId, CancellationToken ct) =>
        Ok(await openingService.GetByAnimeIdAsync(animeId, ct));

    /// <summary>Создать опенинг (только для админа).</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(OpeningDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateOpeningRequest request, CancellationToken ct)
    {
        var result = await openingService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Обновить опенинг (только для админа).</summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(OpeningDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOpeningRequest request, CancellationToken ct) =>
        Ok(await openingService.UpdateAsync(id, request, ct));

    /// <summary>Удалить опенинг (только для админа).</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await openingService.DeleteAsync(id, ct);
        return NoContent();
    }
}
