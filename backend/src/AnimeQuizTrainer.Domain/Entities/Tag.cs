namespace AnimeQuizTrainer.Domain.Entities;

public class Tag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public List<AnimeTag> AnimeTags { get; set; } = [];
}
