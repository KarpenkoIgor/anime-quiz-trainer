using AnimeQuizTrainer.Application.DTOs.Anime;

namespace AnimeQuizTrainer.Application.Services;

public interface IAnimeService
{
    Task<IEnumerable<AnimeDto>> GetAllAsync(CancellationToken ct = default);
    Task<AnimeDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AnimeDto> CreateAsync(CreateAnimeRequest request, CancellationToken ct = default);
    Task<AnimeDto> UpdateAsync(Guid id, UpdateAnimeRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
