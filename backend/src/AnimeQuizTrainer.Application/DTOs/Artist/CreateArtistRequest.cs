using System.ComponentModel.DataAnnotations;

namespace AnimeQuizTrainer.Application.DTOs.Artist;

public record CreateArtistRequest([Required, MaxLength(128)] string Name);
