using AnimeQuizTrainer.Domain.Entities;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Application.Interfaces;

public interface IOpeningRepository
{
    Task<IEnumerable<Opening>> GetAllAsync(CancellationToken ct = default);
    Task<Opening?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Opening>> GetByAnimeIdAsync(Guid animeId, CancellationToken ct = default);
    Task<IEnumerable<Opening>> GetFilteredAsync(
        IEnumerable<Difficulty>? difficulties,
        IEnumerable<Guid>? tagIds,
        int? limit,
        CancellationToken ct = default);
    Task AddAsync(Opening opening, CancellationToken ct = default);
    void Update(Opening opening);
    void Delete(Opening opening);
}
