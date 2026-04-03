using AnimeQuizTrainer.Application.DTOs.Quiz;

namespace AnimeQuizTrainer.Application.Services;

public interface IQuizService
{
    Task<LearnNextResponse?> GetNextLearnAsync(Guid userId, CancellationToken ct = default);
    Task<ReviewResponse> SubmitReviewAsync(Guid userId, ReviewRequest request, CancellationToken ct = default);
    Task<TestStartResponse> StartTestAsync(TestStartRequest request, CancellationToken ct = default);
}
