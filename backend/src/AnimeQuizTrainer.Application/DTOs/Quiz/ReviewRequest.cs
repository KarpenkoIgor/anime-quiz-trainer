using System.ComponentModel.DataAnnotations;
using AnimeQuizTrainer.Domain.Enums;

namespace AnimeQuizTrainer.Application.DTOs.Quiz;

public record ReviewRequest(
    [Required] Guid OpeningId,
    [Required] ReviewQuality Quality
);
