# Backend (.NET 9)

Решение: `backend/AnimeQuizTrainer.sln`, проекты в `backend/src/`:
`Domain` ← `Application` ← `Infrastructure` ← `API`.

## Общие настройки сборки
- `Directory.Build.props` — net9.0, Nullable, **TreatWarningsAsErrors**. Предупреждение = сломанная сборка.
- `Directory.Packages.props` — версии NuGet-пакетов задаются **только здесь** (central package management); в `.csproj` — `PackageReference` без `Version`.
- `.editorconfig` в корне — стиль C# (file-scoped namespaces, `_camelCase` для приватных полей, `I`-префикс интерфейсов).

## Слои и правила
- Контроллеры тонкие: приём DTO → вызов сервиса → результат. Бизнес-логики и обращений к `DbContext` в них нет.
- Сервисы (use-cases) — в `Application`, зависят только от интерфейсов (`I*Repository`, `IUnitOfWork`, `ITokenService`…).
- `Infrastructure` реализует интерфейсы; `AppDbContext` не «протекает» выше репозиториев.
- DTO — `record`; сущности наружу не отдаём.
- Ошибки — доменные исключения (цель: `NotFound`, `Conflict`, `Validation`, `Forbidden`) → `ProblemDetails` в одном месте; не бросать `InvalidOperationException` для бизнес-ошибок.
- Асинхронные методы — суффикс `Async`, принимают `CancellationToken`.
- Конфигурация — типизированные Options с валидацией при старте, а не `config["…"]!`.
- Авторизация: изменение каталога (Anime/Song/Artist/Tag/Franchise/AnimeEntry) — только админ.

## Миграции EF Core
```bash
dotnet ef migrations add <Name> --project backend/src/AnimeQuizTrainer.Infrastructure --startup-project backend/src/AnimeQuizTrainer.API --output-dir Data/Migrations
```
Применённые миграции не редактировать — создать новую. Сгенерированные `*.Designer.cs` и `AppDbContextModelSnapshot.cs` вручную не править.

## Тесты (цель)
`backend/tests/`: `*.Domain.Tests`, `*.Application.Tests` (xUnit, FluentAssertions, NSubstitute), `*.Api.IntegrationTests` (WebApplicationFactory + Testcontainers PostgreSQL). Имена тестов: `Method_Scenario_ExpectedResult`.

## Запуск
`dotnet run --project backend/src/AnimeQuizTrainer.API` → Swagger `http://localhost:5264/swagger`.
Вне Development приложение не стартует со слабым/дефолтным `Jwt:SecretKey` (нужен env `Jwt__SecretKey`, ≥ 32 символа).
