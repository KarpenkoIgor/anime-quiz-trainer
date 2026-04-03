using AnimeQuizTrainer.Application.DTOs.Tag;

namespace AnimeQuizTrainer.Application.Services;

public interface ITagService
{
    Task<IEnumerable<TagDto>> GetAllAsync(CancellationToken ct = default);
    Task<TagDto> CreateAsync(CreateTagRequest request, CancellationToken ct = default);
    Task<TagDto> UpdateAsync(Guid id, CreateTagRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
