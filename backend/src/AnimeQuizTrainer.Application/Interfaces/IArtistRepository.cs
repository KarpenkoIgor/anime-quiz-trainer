using AnimeQuizTrainer.Domain.Entities;

namespace AnimeQuizTrainer.Application.Interfaces;

public interface IArtistRepository
{
    Task<IEnumerable<Artist>> GetAllAsync(CancellationToken ct = default);
    Task<Artist?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(Artist artist, CancellationToken ct = default);
    void Update(Artist artist);
    void Delete(Artist artist);
}
