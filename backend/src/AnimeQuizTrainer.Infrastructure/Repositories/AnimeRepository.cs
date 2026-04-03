using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Domain.Entities;
using AnimeQuizTrainer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AnimeQuizTrainer.Infrastructure.Repositories;

public class AnimeRepository(AppDbContext db) : IAnimeRepository
{
    public async Task<IEnumerable<Anime>> GetAllAsync(CancellationToken ct = default) =>
        await db.Animes.Include(a => a.AnimeTags).ThenInclude(at => at.Tag).ToListAsync(ct);

    public async Task<Anime?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await db.Animes.FindAsync([id], ct);

    public async Task<Anime?> GetByIdWithTagsAsync(Guid id, CancellationToken ct = default) =>
        await db.Animes
            .Include(a => a.AnimeTags).ThenInclude(at => at.Tag)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

    public async Task AddAsync(Anime anime, CancellationToken ct = default) =>
        await db.Animes.AddAsync(anime, ct);

    public void Update(Anime anime) => db.Animes.Update(anime);

    public void Delete(Anime anime) => db.Animes.Remove(anime);
}
