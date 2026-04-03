using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Domain.Entities;
using AnimeQuizTrainer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AnimeQuizTrainer.Infrastructure.Repositories;

public class ArtistRepository(AppDbContext db) : IArtistRepository
{
    public async Task<IEnumerable<Artist>> GetAllAsync(CancellationToken ct = default) =>
        await db.Artists.OrderBy(a => a.Name).ToListAsync(ct);

    public async Task<Artist?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await db.Artists.FindAsync([id], ct);

    public async Task AddAsync(Artist artist, CancellationToken ct = default) =>
        await db.Artists.AddAsync(artist, ct);

    public void Update(Artist artist) => db.Artists.Update(artist);

    public void Delete(Artist artist) => db.Artists.Remove(artist);
}
