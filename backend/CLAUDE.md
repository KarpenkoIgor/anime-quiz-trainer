# Backend (.NET 9)

Solution: `backend/AnimeQuizTrainer.sln`, projects in `backend/src/`:
`Domain` ← `Application` ← `Infrastructure` ← `API`.

## Shared build settings
- `Directory.Build.props` — net9.0, Nullable, **TreatWarningsAsErrors**. A warning breaks the build.
- `Directory.Packages.props` — NuGet package versions are defined **only here** (central package management); `.csproj` files use `PackageReference` without `Version`.
- `.editorconfig` in the repo root — C# style (file-scoped namespaces, `_camelCase` private fields, `I` prefix for interfaces).

## Layers and rules
- Controllers are thin: accept DTO → call service → return result. No business logic and no `DbContext` access.
- Services (use cases) live in `Application` and depend only on interfaces (`I*Repository`, `IUnitOfWork`, `ITokenService`, …).
- `Infrastructure` implements the interfaces; `AppDbContext` must not leak above the repositories.
- DTOs are `record`s; never expose entities.
- Errors are domain exceptions (target: `NotFound`, `Conflict`, `Validation`, `Forbidden`) mapped to `ProblemDetails` in one place; do not throw `InvalidOperationException` for business errors.
- Async methods use the `Async` suffix and take a `CancellationToken`.
- Configuration is typed Options validated at startup, not `config["…"]!`.
- Authorization: changing the catalog (Anime/Song/Artist/Tag/Franchise/AnimeEntry) is admin-only.

## EF Core migrations
```bash
dotnet ef migrations add <Name> --project backend/src/AnimeQuizTrainer.Infrastructure --startup-project backend/src/AnimeQuizTrainer.API --output-dir Data/Migrations
```
Never edit applied migrations — create a new one. Do not hand-edit generated `*.Designer.cs` and `AppDbContextModelSnapshot.cs`.

## Tests (target)
`backend/tests/`: `*.Domain.Tests`, `*.Application.Tests` (xUnit, FluentAssertions, NSubstitute), `*.Api.IntegrationTests` (WebApplicationFactory + Testcontainers PostgreSQL). Test names: `Method_Scenario_ExpectedResult`.

## Running
`dotnet run --project backend/src/AnimeQuizTrainer.API` → Swagger at `http://localhost:5264/swagger`.
Outside Development the app refuses to start with a weak/default `Jwt:SecretKey` (set env `Jwt__SecretKey`, ≥ 32 chars).
