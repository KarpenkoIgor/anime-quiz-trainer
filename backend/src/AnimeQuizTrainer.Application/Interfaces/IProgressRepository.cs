using AnimeQuizTrainer.Domain.Entities;

namespace AnimeQuizTrainer.Application.Interfaces;

public interface IProgressRepository
{
    Task<UserOpeningProgress?> GetAsync(Guid userId, Guid openingId, CancellationToken ct = default);
    Task<IEnumerable<UserOpeningProgress>> GetDueAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<UserOpeningProgress>> GetAllByUserAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(UserOpeningProgress progress, CancellationToken ct = default);
    void Update(UserOpeningProgress progress);
}
