using System.ComponentModel.DataAnnotations;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Application.DTOs.Opening;

public record CreateOpeningRequest(
    [Required] Guid AnimeEntryId,
    [Required] Guid ArtistId,
    [Required, MaxLength(256)] string SongTitle,
    [Required, Url] string YoutubeUrl,
    [Range(1, 100)] int OrderNumber,
    Difficulty Difficulty,
    double? StartTiming,
    double ChorusTiming
);
