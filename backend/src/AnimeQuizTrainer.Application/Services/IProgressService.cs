using AnimeQuizTrainer.Application.DTOs.Progress;

namespace AnimeQuizTrainer.Application.Services;

public interface IProgressService
{
    Task<UserProgressSummaryDto> GetSummaryAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<OpeningProgressDto>> GetOpeningsProgressAsync(Guid userId, CancellationToken ct = default);
}
