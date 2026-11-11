# anime-quiz-trainer

Тренажёр-квиз по аниме (угадывание опенингов/эндингов и т. д.) с интервальными повторениями.
В перспективе: мультиплеер с рейтингом/ладдером, продвинутый профиль. Над проектом работает несколько человек.

Язык общения и документации — русский; идентификаторы в коде, коммиты и PR — английский.

## Стек и структура

| Часть | Технологии | Путь |
|---|---|---|
| Backend | ASP.NET Core 9, EF Core 9 + Npgsql (PostgreSQL), JWT + refresh-токены, BCrypt, Swagger | `backend/` |
| Frontend | Next.js 16 (App Router), React 19, TypeScript strict, MobX, MUI 7, react-hook-form + zod | `frontend/` |
| Документация | спеки, ADR, архитектура, гайды | `docs/` (создаётся по плану) |
| Настройка Claude | агенты, скиллы, хуки, правила | `.claude/`, карта для людей: `docs/claude/` |

Доменная иерархия: `Franchise → Anime → AnimeEntry → Song`; также `Artist`, `Tag`, `User`, `RefreshToken`, `UserSongProgress`.

## Команды

```bash
# Backend (из корня репозитория)
dotnet build backend                                   # сборка, предупреждения = ошибки
dotnet test backend                                    # тесты (появятся в фазе тестов)
dotnet run --project backend/src/AnimeQuizTrainer.API  # API, Swagger: http://localhost:5264/swagger

# Frontend (из frontend/)
npm run dev          # нужны локальные mkcert-сертификаты localhost+2*.pem (в .gitignore)
npm run lint
npm run typecheck
npm run build
```

Локальная БД: PostgreSQL, строка подключения в `backend/src/AnimeQuizTrainer.API/appsettings.json`. Секреты — только через переменные окружения / user-secrets (`Jwt__SecretKey`, `ConnectionStrings__DefaultConnection`).

## Архитектура backend (Clean Architecture)

Направление зависимостей строго внутрь: `API → Infrastructure → Application → Domain`.
- `Domain` — сущности, перечисления, доменная логика; ни от чего не зависит.
- `Application` — use-case сервисы, интерфейсы репозиториев/UoW, DTO, валидация.
- `Infrastructure` — EF Core, репозитории, JWT/BCrypt и прочие адаптеры.
- `API` — контроллеры (тонкие), middleware, DI, конфигурация.

Текущий долг (будет устранён поэтапно, см. docs/ когда появятся): сервисы лежат в Infrastructure вместо Application; `AuthService` зависит от `AppDbContext`; нет политик авторизации для админских операций. **Новый код пишем сразу по целевой архитектуре**, а не копируем старые нарушения.

Подробности: `backend/CLAUDE.md`, `.claude/rules/`.

## Правила работы (обязательно)

1. **Ветки и коммиты:** trunk-based. Работа только в короткоживущих ветках `feat/…`, `fix/…`, `chore/…`, `docs/…` от `main`; в `main` — через PR (squash). Коммиты — Conventional Commits (`feat(quiz): …`). Не пушить в `main`, не использовать `--force`.
2. **Секреты:** никогда не коммитить пароли, ключи, строки подключения прод-БД, дампы (`*.sql`, `*.dump`). Не читать `.env*`.
3. **Тесты:** новая логика — с тестами. Исправление бага начинается с теста, воспроизводящего баг.
4. **EF-миграции:** только через `dotnet ef migrations add`; применённые миграции не править; на не-локальную БД не применять без явной просьбы пользователя.
5. **Проверка перед «готово»:** `dotnet build backend` и в `frontend/` `npm run typecheck && npm run lint`. Не заявлять об успехе без запуска.
6. **Не раздувать скоуп:** без побочных рефакторингов в рамках другой задачи; замеченное — в отдельную заметку/issue.
7. **Документация живёт с кодом:** меняется поведение → обновить спеку в `docs/specs/`, архитектурное решение → ADR в `docs/adr/`.

## Куда смотреть

- Правила по путям: `.claude/rules/` (подгружаются автоматически).
- Агенты-специалисты: `.claude/agents/`; процедуры: `.claude/skills/`.
- Frontend-специфика и предупреждение про версию Next.js: `frontend/AGENTS.md`.
