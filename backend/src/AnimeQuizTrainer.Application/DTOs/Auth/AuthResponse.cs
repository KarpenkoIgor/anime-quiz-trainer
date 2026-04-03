namespace AnimeQuizTrainer.Application.DTOs.Auth;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserInfo User
);

public record UserInfo(Guid Id, string Username, string Email, bool IsAdmin);
