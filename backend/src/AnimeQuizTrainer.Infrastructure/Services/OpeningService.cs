using AnimeQuizTrainer.Application.DTOs.Artist;
using AnimeQuizTrainer.Application.DTOs.Opening;
using AnimeQuizTrainer.Application.Interfaces;
using AnimeQuizTrainer.Application.Services;
using AnimeQuizTrainer.Domain.Entities;

namespace AnimeQuizTrainer.Infrastructure.Services;

public class OpeningService(
    IOpeningRepository openings,
    IAnimeRepository animes,
    IArtistRepository artists,
    IUnitOfWork uow) : IOpeningService
{
    public async Task<IEnumerable<OpeningDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await openings.GetAllAsync(ct);
        return list.Select(ToDto);
    }

    public async Task<OpeningDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var opening = await openings.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Опенинг {id} не найден.");
        return ToDto(opening);
    }

    public async Task<IEnumerable<OpeningDto>> GetByAnimeIdAsync(Guid animeId, CancellationToken ct = default)
    {
        var list = await openings.GetByAnimeIdAsync(animeId, ct);
        return list.Select(ToDto);
    }

    public async Task<OpeningDto> CreateAsync(CreateOpeningRequest request, CancellationToken ct = default)
    {
        _ = await animes.GetByIdAsync(request.AnimeId, ct)
            ?? throw new KeyNotFoundException($"Аниме {request.AnimeId} не найдено.");
        _ = await artists.GetByIdAsync(request.ArtistId, ct)
            ?? throw new KeyNotFoundException($"Исполнитель {request.ArtistId} не найден.");

        var opening = new Opening
        {
            AnimeId = request.AnimeId,
            ArtistId = request.ArtistId,
            SongTitle = request.SongTitle,
            YoutubeUrl = request.YoutubeUrl,
            OrderNumber = request.OrderNumber,
            Difficulty = request.Difficulty,
            StartTiming = request.StartTiming,
            ChorusTiming = request.ChorusTiming
        };

        await openings.AddAsync(opening, ct);
        await uow.SaveChangesAsync(ct);

        return ToDto((await openings.GetByIdAsync(opening.Id, ct))!);
    }

    public async Task<OpeningDto> UpdateAsync(Guid id, UpdateOpeningRequest request, CancellationToken ct = default)
    {
        var opening = await openings.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Опенинг {id} не найден.");

        _ = await artists.GetByIdAsync(request.ArtistId, ct)
            ?? throw new KeyNotFoundException($"Исполнитель {request.ArtistId} не найден.");

        opening.ArtistId = request.ArtistId;
        opening.SongTitle = request.SongTitle;
        opening.YoutubeUrl = request.YoutubeUrl;
        opening.OrderNumber = request.OrderNumber;
        opening.Difficulty = request.Difficulty;
        opening.StartTiming = request.StartTiming;
        opening.ChorusTiming = request.ChorusTiming;

        openings.Update(opening);
        await uow.SaveChangesAsync(ct);

        return ToDto((await openings.GetByIdAsync(opening.Id, ct))!);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var opening = await openings.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Опенинг {id} не найден.");
        openings.Delete(opening);
        await uow.SaveChangesAsync(ct);
    }

    public static OpeningDto ToDto(Opening o) => new(
        o.Id,
        o.AnimeId,
        o.Anime.Title,
        new ArtistDto(o.Artist.Id, o.Artist.Name),
        o.SongTitle,
        o.YoutubeUrl,
        o.OrderNumber,
        o.Difficulty,
        o.StartTiming,
        o.ChorusTiming,
        o.CreatedAt);
}
