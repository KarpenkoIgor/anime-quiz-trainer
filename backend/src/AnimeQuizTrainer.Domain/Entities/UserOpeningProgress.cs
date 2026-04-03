namespace AnimeQuizTrainer.Domain.Entities;

public class UserOpeningProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid OpeningId { get; set; }
    public Opening Opening { get; set; } = null!;

    /// <summary>Current interval in days (SM-2).</summary>
    public int IntervalDays { get; set; } = 1;

    /// <summary>Ease factor (SM-2), starts at 2.5.</summary>
    public double EaseFactor { get; set; } = 2.5;

    /// <summary>Total number of reviews performed.</summary>
    public int ReviewCount { get; set; }

    /// <summary>When this opening is due for the next review. Null = not started yet.</summary>
    public DateTime? NextReviewAt { get; set; }

    public DateTime? LastReviewedAt { get; set; }
}
