using AnimeQuizTrainer.Application.DTOs.Progress;
using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Application.Services;

namespace AnimeQuizTrainer.Infrastructure.Services;

public class ProgressService(IProgressRepository progress) : IProgressService
{
    public async Task<UserProgressSummaryDto> GetSummaryAsync(Guid userId, CancellationToken ct = default)
    {
        var all = (await progress.GetAllByUserAsync(userId, ct)).ToList();
        var due = all.Count(p => p.NextReviewAt <= DateTime.UtcNow);
        var neverReviewed = all.Count(p => p.ReviewCount == 0);

        return new UserProgressSummaryDto(all.Count, due, neverReviewed);
    }

    public async Task<IEnumerable<OpeningProgressDto>> GetOpeningsProgressAsync(Guid userId, CancellationToken ct = default)
    {
        var all = await progress.GetAllByUserAsync(userId, ct);
        return all.Select(p => new OpeningProgressDto(
            OpeningService.ToDto(p.Opening),
            p.IntervalDays,
            p.EaseFactor,
            p.ReviewCount,
            p.NextReviewAt,
            p.LastReviewedAt,
            IsNew: p.ReviewCount == 0));
    }
}
