---
name: db-migration
description: Safely creates an EF Core migration for PostgreSQL — generation, code/SQL review, rollback plan. Use for any entity or EF configuration change that affects the DB schema.
argument-hint: "<MigrationName>"
disable-model-invocation: true
---

# /db-migration — schema migration

Migration name: **$ARGUMENTS** (PascalCase, verb + subject, e.g. `AddUserRating`).

1. Make sure the entities/configurations (`Infrastructure/Data/Configurations/`) are changed and `dotnet build backend` passes.
2. Generate:
   ```bash
   dotnet ef migrations add $ARGUMENTS --project backend/src/AnimeQuizTrainer.Infrastructure --startup-project backend/src/AnimeQuizTrainer.API --output-dir Data/Migrations
   ```
3. Read the generated migration and check it (involve `db-engineer`): no `DropColumn/DropTable` with data loss, no NOT NULL without a default, no drop+create where `RenameColumn/RenameTable` applies, no unrelated snapshot changes.
4. Show the user the review result and a rollback plan (`dotnet ef migrations remove` for an unapplied migration; a new reverse migration for an applied one). Report in Russian.
5. **Do not run `dotnet ef database update`.** Applying is only to a local DB and only on the user's explicit request (the hook will ask for confirmation). Never to prod.
6. Migrations and `ModelSnapshot` are never hand-edited (the `guard-files` hook blocks it).
