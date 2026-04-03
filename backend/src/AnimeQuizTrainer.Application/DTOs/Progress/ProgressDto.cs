using AnimeQuizTrainer.Application.DTOs.Opening;

namespace AnimeQuizTrainer.Application.DTOs.Progress;

public record UserProgressSummaryDto(
    int TotalTracked,
    int DueToday,
    int NeverReviewed
);

public record OpeningProgressDto(
    OpeningDto Opening,
    int IntervalDays,
    double EaseFactor,
    int ReviewCount,
    DateTime? NextReviewAt,
    DateTime? LastReviewedAt,
    bool IsNew
);
