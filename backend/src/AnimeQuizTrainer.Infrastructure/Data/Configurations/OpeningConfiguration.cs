using AnimeQuizTrainer.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeQuizTrainer.Infrastructure.Data.Configurations;

public class OpeningConfiguration : IEntityTypeConfiguration<Opening>
{
    public void Configure(EntityTypeBuilder<Opening> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.SongTitle).IsRequired().HasMaxLength(256);
        builder.Property(o => o.YoutubeUrl).IsRequired().HasMaxLength(512);
        builder.Property(o => o.Difficulty).HasConversion<string>();

        builder.HasOne(o => o.Anime)
            .WithMany(a => a.Openings)
            .HasForeignKey(o => o.AnimeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(o => o.Artist)
            .WithMany(a => a.Openings)
            .HasForeignKey(o => o.ArtistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(o => new { o.AnimeId, o.OrderNumber }).IsUnique();
    }
}
