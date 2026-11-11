---
paths:
  - "backend/src/**/*.cs"
---

# Backend: границы слоёв (Clean Architecture)

Зависимости только внутрь: `API → Infrastructure → Application → Domain`.

- `Domain` не ссылается ни на что (ни EF, ни ASP.NET, ни DI).
- `Application` не ссылается на `Infrastructure`/`API`, не использует `DbContext`, `HttpContext`, `IConfiguration`. Внешние зависимости — через интерфейсы, объявленные в `Application`.
- `Infrastructure` реализует интерфейсы `Application`; сущности EF и `AppDbContext` не возвращает наружу репозиториев.
- `API`: контроллер — только маппинг HTTP ↔ вызов сервиса. Никакой бизнес-логики, никаких обращений к репозиториям/`DbContext`.
- Новая бизнес-логика — в `Application` (или в сущностях `Domain`, если это инвариант сущности), **даже если соседний старый код лежит в Infrastructure** (это известный долг).
- Не добавлять `PackageReference` с версией в `.csproj` — версии в `backend/Directory.Packages.props`.
- Бизнес-ошибки — доменные исключения, не `InvalidOperationException`/`KeyNotFoundException`.
- Публичные методы сервисов и репозиториев — `async`, с `CancellationToken`, суффикс `Async`.
- Сущности наружу (в ответы API) не отдавать — только DTO (`record`).
