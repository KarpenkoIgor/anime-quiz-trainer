using AnimeQuizTrainer.Application.DTOs.Quiz;
using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Application.Services;
using AnimeQuizTrainer.Domain.Entities;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Infrastructure.Services;

public class QuizService(
    IOpeningRepository openings,
    IProgressRepository progress,
    IUnitOfWork uow) : IQuizService
{
    public async Task<LearnNextResponse?> GetNextLearnAsync(Guid userId, CancellationToken ct = default)
    {
        // First: due cards
        var due = (await progress.GetDueAsync(userId, ct)).FirstOrDefault();
        if (due is not null)
        {
            return new LearnNextResponse(
                OpeningService.ToDto(due.Opening),
                IsNew: false,
                due.ReviewCount,
                due.NextReviewAt);
        }

        // Second: new card (no progress record yet)
        var allOpenings = await openings.GetAllAsync(ct);
        var trackedIds = (await progress.GetAllByUserAsync(userId, ct)).Select(p => p.OpeningId).ToHashSet();
        var newOpening = allOpenings.FirstOrDefault(o => !trackedIds.Contains(o.Id));

        if (newOpening is null)
            return null;

        return new LearnNextResponse(
            OpeningService.ToDto(newOpening),
            IsNew: true,
            ReviewCount: 0,
            NextReviewAt: null);
    }

    public async Task<ReviewResponse> SubmitReviewAsync(Guid userId, ReviewRequest request, CancellationToken ct = default)
    {
        var record = await progress.GetAsync(userId, request.OpeningId, ct);

        if (record is null)
        {
            record = new UserOpeningProgress
            {
                UserId = userId,
                OpeningId = request.OpeningId
            };
            await progress.AddAsync(record, ct);
        }

        ApplySm2(record, request.Quality);
        record.ReviewCount++;
        record.LastReviewedAt = DateTime.UtcNow;

        progress.Update(record);
        await uow.SaveChangesAsync(ct);

        return new ReviewResponse(request.OpeningId, record.IntervalDays, record.NextReviewAt!.Value);
    }

    public async Task<TestStartResponse> StartTestAsync(TestStartRequest request, CancellationToken ct = default)
    {
        var filtered = await openings.GetFilteredAsync(
            request.Difficulties,
            request.TagIds,
            request.Count,
            ct);

        var items = filtered.Select(o =>
        {
            var startAt = request.StartFrom switch
            {
                StartFrom.Chorus => o.ChorusTiming,
                StartFrom.Beginning => o.StartTiming ?? 0,
                StartFrom.Random => PickRandomStart(o),
                _ => 0
            };
            return new TestOpeningItem(OpeningService.ToDto(o), startAt);
        }).ToList();

        return new TestStartResponse(items, request.StartFrom, request.SegmentSeconds);
    }

    // SM-2 algorithm
    private static void ApplySm2(UserOpeningProgress record, ReviewQuality quality)
    {
        switch (quality)
        {
            case ReviewQuality.Forgot:
                record.IntervalDays = 1;
                break;
            case ReviewQuality.Hard:
                record.IntervalDays = Math.Max(1, (int)(record.IntervalDays * 1.2));
                record.EaseFactor = Math.Max(1.3, record.EaseFactor - 0.15);
                break;
            case ReviewQuality.Medium:
                record.IntervalDays = Math.Max(1, (int)(record.IntervalDays * record.EaseFactor));
                break;
            case ReviewQuality.Easy:
                record.IntervalDays = Math.Max(1, (int)(record.IntervalDays * record.EaseFactor * 1.3));
                record.EaseFactor = Math.Min(4.0, record.EaseFactor + 0.1);
                break;
        }

        record.NextReviewAt = DateTime.UtcNow.AddDays(record.IntervalDays);
    }

    private static double PickRandomStart(Opening o)
    {
        var options = new List<double>();
        if (o.StartTiming.HasValue) options.Add(o.StartTiming.Value);
        options.Add(o.ChorusTiming);
        return options[Random.Shared.Next(options.Count)];
    }
}
