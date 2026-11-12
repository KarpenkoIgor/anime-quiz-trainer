---
paths:
  - "backend/src/**/*.cs"
---

# Backend: layer boundaries (Clean Architecture)

Dependencies point inward only: `API → Infrastructure → Application → Domain`.

- `Domain` references nothing (no EF, no ASP.NET, no DI).
- `Application` must not reference `Infrastructure`/`API` and must not use `DbContext`, `HttpContext` or `IConfiguration`. External dependencies go through interfaces declared in `Application`.
- `Infrastructure` implements `Application` interfaces; EF entities and `AppDbContext` never leave the repositories.
- `API`: a controller only maps HTTP ↔ a service call. No business logic, no repository/`DbContext` access.
- New business logic goes into `Application` (or into `Domain` entities if it is an entity invariant), **even if neighboring legacy code lives in Infrastructure** (known debt).
- Do not add `PackageReference` with a version to a `.csproj` — versions live in `backend/Directory.Packages.props`.
- Business errors are domain exceptions, not `InvalidOperationException`/`KeyNotFoundException`.
- Public service/repository methods are `async`, take a `CancellationToken`, and use the `Async` suffix.
- Never return entities from the API — only DTOs (`record`).
