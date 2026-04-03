using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Domain.Entities;
using AnimeQuizTrainer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AnimeQuizTrainer.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await db.Users.FindAsync([id], ct);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        await db.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower(), ct);

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default) =>
        await db.Users.AnyAsync(u => u.Email == email.ToLower(), ct);

    public async Task<bool> ExistsByUsernameAsync(string username, CancellationToken ct = default) =>
        await db.Users.AnyAsync(u => u.Username == username, ct);

    public async Task AddAsync(User user, CancellationToken ct = default) =>
        await db.Users.AddAsync(user, ct);

    public void Update(User user) => db.Users.Update(user);
}
