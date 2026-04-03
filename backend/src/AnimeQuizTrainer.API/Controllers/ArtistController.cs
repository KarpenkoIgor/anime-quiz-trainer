using AnimeQuizTrainer.Application.DTOs.Artist;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Управление исполнителями/группами.</summary>
[ApiController]
[Route("api/[controller]")]
public class ArtistController(IArtistService artistService) : ControllerBase
{
    /// <summary>Получить всех исполнителей.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ArtistDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await artistService.GetAllAsync(ct));

    /// <summary>Получить исполнителя по ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ArtistDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct) =>
        Ok(await artistService.GetByIdAsync(id, ct));

    /// <summary>Создать исполнителя (только для админа).</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ArtistDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateArtistRequest request, CancellationToken ct)
    {
        var result = await artistService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Обновить исполнителя (только для админа).</summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ArtistDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateArtistRequest request, CancellationToken ct) =>
        Ok(await artistService.UpdateAsync(id, request, ct));

    /// <summary>Удалить исполнителя (только для админа).</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await artistService.DeleteAsync(id, ct);
        return NoContent();
    }
}
