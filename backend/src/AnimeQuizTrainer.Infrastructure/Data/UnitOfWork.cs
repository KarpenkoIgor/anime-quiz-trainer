using AnimeQuizTrainer.Application.Interfaces;

namespace AnimeQuizTrainer.Infrastructure.Data;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        db.SaveChangesAsync(ct);
}
