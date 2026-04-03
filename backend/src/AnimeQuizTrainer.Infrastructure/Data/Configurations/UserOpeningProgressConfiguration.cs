using AnimeQuizTrainer.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeQuizTrainer.Infrastructure.Data.Configurations;

public class UserOpeningProgressConfiguration : IEntityTypeConfiguration<UserOpeningProgress>
{
    public void Configure(EntityTypeBuilder<UserOpeningProgress> builder)
    {
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => new { p.UserId, p.OpeningId }).IsUnique();

        builder.HasOne(p => p.User)
            .WithMany(u => u.OpeningProgresses)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Opening)
            .WithMany(o => o.UserProgresses)
            .HasForeignKey(p => p.OpeningId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
