namespace AnimeQuizTrainer.Application.DTOs.Quiz;

public record ReviewResponse(
    Guid OpeningId,
    int NewIntervalDays,
    DateTime NextReviewAt
);
