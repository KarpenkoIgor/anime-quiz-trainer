# anime-quiz-trainer

Anime quiz trainer (guess openings/endings, etc.) with spaced repetition.
Planned: multiplayer with rating/ladder, advanced user profile. Several people work on the project.

Communication language with the team and human-facing docs (`docs/`) is Russian. Everything machine-read (this file, rules, agents, skills, hooks), identifiers, commits and PRs is English.

## Stack and layout

| Part | Technology | Path |
|---|---|---|
| Backend | ASP.NET Core 9, EF Core 9 + Npgsql (PostgreSQL), JWT + refresh tokens, BCrypt, Swagger | `backend/` |
| Frontend | Next.js 16 (App Router), React 19, TypeScript strict, MobX, MUI 7, react-hook-form + zod | `frontend/` |
| Documentation | specs, ADRs, architecture, guides | `docs/` (grows per roadmap) |
| Claude setup | agents, skills, hooks, rules | `.claude/`, human-facing map: `docs/claude/` |

Domain hierarchy: `Franchise → Anime → AnimeEntry → Song`; also `Artist`, `Tag`, `User`, `RefreshToken`, `UserSongProgress`.

## Commands

```bash
# Backend (from repo root)
dotnet build backend                                   # build, warnings are errors
dotnet test backend                                    # tests (a test project is planned)
dotnet run --project backend/src/AnimeQuizTrainer.API  # API, Swagger: http://localhost:5264/swagger

# Frontend (from frontend/)
npm run dev          # needs local mkcert certificates localhost+2*.pem (gitignored)
npm run lint
npm run typecheck
npm run build
```

Local DB: PostgreSQL; connection string in `backend/src/AnimeQuizTrainer.API/appsettings.json`. Secrets only via environment variables / user-secrets (`Jwt__SecretKey`, `ConnectionStrings__DefaultConnection`).

## Backend architecture (Clean Architecture)

Dependencies point strictly inward: `API → Infrastructure → Application → Domain`.
- `Domain` — entities, enums, domain logic; depends on nothing.
- `Application` — use-case services, repository/UoW interfaces, DTOs, validation.
- `Infrastructure` — EF Core, repositories, JWT/BCrypt and other adapters.
- `API` — controllers (thin), middleware, DI, configuration.

Known debt (to be removed step by step): services live in Infrastructure instead of Application; `AuthService` depends on `AppDbContext`; no authorization policies for admin operations. **Write new code to the target architecture right away**; do not copy the old violations.

Details: `backend/CLAUDE.md`, `.claude/rules/`.

## Working rules (mandatory)

1. **Branches and commits:** trunk-based. Work only in short-lived branches `feat/…`, `fix/…`, `chore/…`, `docs/…` from `main`; merge to `main` via PR (squash). Conventional Commits (`feat(quiz): …`). Never push to `main`, never use `--force`.
2. **Secrets:** never commit passwords, keys, production connection strings or DB dumps (`*.sql`, `*.dump`). Do not read `.env*`.
3. **Tests:** new logic comes with tests. A bug fix starts with a test that reproduces the bug.
4. **EF migrations:** only via `dotnet ef migrations add`; never edit applied migrations; never apply to a non-local DB unless the user explicitly asks.
5. **Verify before "done":** `dotnet build backend`, and in `frontend/` `npm run typecheck && npm run lint`. Do not claim success without running them.
6. **No scope creep:** no drive-by refactors inside another task; note what you noticed separately (issue/report).
7. **Docs live with code:** behavior changes → update the spec in `docs/specs/`; architectural decisions → ADR in `docs/adr/`.

## Where to look

- Path-scoped rules: `.claude/rules/` (loaded automatically).
- Specialist agents: `.claude/agents/`; procedures: `.claude/skills/`.
- Frontend specifics and the Next.js version warning: `frontend/AGENTS.md`.
