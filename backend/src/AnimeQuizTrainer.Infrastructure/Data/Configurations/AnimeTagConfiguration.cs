using AnimeQuizTrainer.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeQuizTrainer.Infrastructure.Data.Configurations;

public class AnimeTagConfiguration : IEntityTypeConfiguration<AnimeTag>
{
    public void Configure(EntityTypeBuilder<AnimeTag> builder)
    {
        builder.HasKey(at => new { at.AnimeId, at.TagId });

        builder.HasOne(at => at.Anime)
            .WithMany(a => a.AnimeTags)
            .HasForeignKey(at => at.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(at => at.Tag)
            .WithMany(t => t.AnimeTags)
            .HasForeignKey(at => at.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
