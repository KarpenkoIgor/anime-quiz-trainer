using AnimeQuizTrainer.Application.DTOs.Artist;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Application.DTOs.Opening;

public record OpeningDto(
    Guid Id,
    Guid AnimeEntryId,
    string AnimeEntryTitle,
    Guid AnimeId,
    string AnimeTitle,
    ArtistDto Artist,
    string SongTitle,
    string YoutubeUrl,
    int OrderNumber,
    Difficulty Difficulty,
    double? StartTiming,
    double ChorusTiming,
    DateTime CreatedAt
);
