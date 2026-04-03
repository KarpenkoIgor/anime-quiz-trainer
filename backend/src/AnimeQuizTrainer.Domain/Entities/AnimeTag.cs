namespace AnimeQuizTrainer.Domain.Entities;

public class AnimeTag
{
    public Guid AnimeId { get; set; }
    public Anime Anime { get; set; } = null!;

    public Guid TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}
