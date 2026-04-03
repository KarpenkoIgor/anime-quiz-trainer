using AnimeQuizTrainer.Application.DTOs.Artist;

namespace AnimeQuizTrainer.Application.Services;

public interface IArtistService
{
    Task<IEnumerable<ArtistDto>> GetAllAsync(CancellationToken ct = default);
    Task<ArtistDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ArtistDto> CreateAsync(CreateArtistRequest request, CancellationToken ct = default);
    Task<ArtistDto> UpdateAsync(Guid id, CreateArtistRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
