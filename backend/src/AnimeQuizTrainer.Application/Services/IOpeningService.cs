using AnimeQuizTrainer.Application.DTOs.Opening;

namespace AnimeQuizTrainer.Application.Services;

public interface IOpeningService
{
    Task<IEnumerable<OpeningDto>> GetAllAsync(CancellationToken ct = default);
    Task<OpeningDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<OpeningDto>> GetByAnimeIdAsync(Guid animeId, CancellationToken ct = default);
    Task<OpeningDto> CreateAsync(CreateOpeningRequest request, CancellationToken ct = default);
    Task<OpeningDto> UpdateAsync(Guid id, UpdateOpeningRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
