using System.ComponentModel.DataAnnotations;

namespace AnimeQuizTrainer.Application.DTOs.Tag;

public record CreateTagRequest([Required, MaxLength(64)] string Name);
