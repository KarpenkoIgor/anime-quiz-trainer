# Git workflow

- Trunk-based: `main` is always working. Work in short branches `feat/<topic>`, `fix/<topic>`, `chore/<topic>`, `docs/<topic>` cut from `main`; merge via PR (squash).
- Commits follow Conventional Commits: `type(scope): summary`, imperative mood, ≤ 72 chars.
  Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`. Scopes: `quiz`, `auth`, `catalog`, `profile`, `api`, `web`, `infra`, `claude`, …
- One commit = one logical change; do not mix formatting with behavior changes.
- Never commit to `main`; never use `git push --force`, `git reset --hard` or `--no-verify` unless the user explicitly asks.
- Never commit secrets, DB dumps (`*.sql`, `*.dump`) or local settings (`.claude/settings.local.json`, `.env*`).
- A PR explains **what and why**, links the issue (`Closes #N`) and contains a verification plan.
