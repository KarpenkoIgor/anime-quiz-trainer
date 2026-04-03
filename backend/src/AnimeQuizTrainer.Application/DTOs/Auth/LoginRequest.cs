using System.ComponentModel.DataAnnotations;

namespace AnimeQuizTrainer.Application.DTOs.Auth;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
