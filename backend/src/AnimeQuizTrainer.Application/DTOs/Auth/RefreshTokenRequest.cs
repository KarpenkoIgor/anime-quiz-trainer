using System.ComponentModel.DataAnnotations;

namespace AnimeQuizTrainer.Application.DTOs.Auth;

public record RefreshTokenRequest([Required] string RefreshToken);
