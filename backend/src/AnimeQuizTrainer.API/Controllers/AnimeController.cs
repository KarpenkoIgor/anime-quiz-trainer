using AnimeQuizTrainer.Application.DTOs.Anime;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Управление аниме.</summary>
[ApiController]
[Route("api/[controller]")]
public class AnimeController(IAnimeService animeService) : ControllerBase
{
    /// <summary>Получить список всех аниме с тегами.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AnimeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await animeService.GetAllAsync(ct));

    /// <summary>Получить аниме по ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(AnimeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct) =>
        Ok(await animeService.GetByIdAsync(id, ct));

    /// <summary>Создать аниме (только для админа).</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(AnimeDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateAnimeRequest request, CancellationToken ct)
    {
        var result = await animeService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Обновить аниме (только для админа).</summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(AnimeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAnimeRequest request, CancellationToken ct) =>
        Ok(await animeService.UpdateAsync(id, request, ct));

    /// <summary>Удалить аниме (только для админа).</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await animeService.DeleteAsync(id, ct);
        return NoContent();
    }
}
