using AnimeQuizTrainer.Application.DTOs.Opening;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Application.DTOs.Quiz;

public record TestStartResponse(
    List<TestOpeningItem> Openings,
    StartFrom StartFrom,
    int SegmentSeconds
);

public record TestOpeningItem(
    OpeningDto Opening,
    double StartAtSeconds
);
