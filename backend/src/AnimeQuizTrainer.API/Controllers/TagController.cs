using AnimeQuizTrainer.Application.DTOs.Tag;
using AnimeQuizTrainer.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeQuizTrainer.API.Controllers;

/// <summary>Управление тегами.</summary>
[ApiController]
[Route("api/[controller]")]
public class TagController(ITagService tagService) : ControllerBase
{
    /// <summary>Получить все теги.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TagDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await tagService.GetAllAsync(ct));

    /// <summary>Создать тег (только для админа).</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(TagDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateTagRequest request, CancellationToken ct)
    {
        var result = await tagService.CreateAsync(request, ct);
        return Created(string.Empty, result);
    }

    /// <summary>Обновить тег (только для админа).</summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TagDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateTagRequest request, CancellationToken ct) =>
        Ok(await tagService.UpdateAsync(id, request, ct));

    /// <summary>Удалить тег (только для админа).</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await tagService.DeleteAsync(id, ct);
        return NoContent();
    }
}
