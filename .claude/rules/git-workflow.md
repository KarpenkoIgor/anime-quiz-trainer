# Git workflow

- Trunk-based: `main` всегда рабочий. Работа — в коротких ветках `feat/<topic>`, `fix/<topic>`, `chore/<topic>`, `docs/<topic>` от `main`; слияние через PR (squash).
- Коммиты — Conventional Commits: `type(scope): summary` в повелительном наклонении, ≤ 72 символов.
  Типы: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`. Scope: `quiz`, `auth`, `catalog`, `profile`, `api`, `web`, `infra`, `claude`…
- Один коммит — одна логическая правка; не смешивать форматирование и изменение поведения.
- Не коммитить в `main`, не использовать `git push --force`, `git reset --hard`, `--no-verify` без явной просьбы пользователя.
- Не коммитить секреты, дампы БД (`*.sql`, `*.dump`), локальные настройки (`.claude/settings.local.json`, `.env*`).
- PR описывает **что и зачем**, ссылается на issue (`Closes #N`), содержит план проверки.
