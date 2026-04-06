using AnimeQuizTrainer.Application.DTOs.Common;
using AnimeQuizTrainer.Application.DTOs.Opening;

namespace AnimeQuizTrainer.Application.Services;

public interface IOpeningService
{
    Task<PagedResult<OpeningDto>> GetListAsync(
        string? filterText, string? sorting, int skipCount, int maxResultCount, CancellationToken ct = default);
    Task<OpeningDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<OpeningDto>> GetListByAnimeEntryIdAsync(
        Guid animeEntryId, string? filterText, string? sorting, int skipCount, int maxResultCount, CancellationToken ct = default);
    Task<OpeningDto> CreateAsync(CreateOpeningRequest request, CancellationToken ct = default);
    Task<OpeningDto> UpdateAsync(Guid id, UpdateOpeningRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
