using System.ComponentModel.DataAnnotations;

namespace AnimeQuizTrainer.Application.DTOs.Auth;

public record RegisterRequest(
    [Required, MinLength(3), MaxLength(32)] string Username,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password
);
