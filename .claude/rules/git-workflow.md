# Git workflow

- Trunk-based: `main` is always working. Work in short branches `feat/<topic>`, `fix/<topic>`, `chore/<topic>`, `docs/<topic>` cut from `main`; merge via PR (squash).
- Commits follow Conventional Commits: `type(scope): summary`, imperative mood, ≤ 72 chars.
  Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`. Scopes: `quiz`, `auth`, `catalog`, `profile`, `api`, `web`, `infra`, `claude`, …
- One commit = one logical change; do not mix formatting with behavior changes.
- Never commit to `main`; never use `git push --force`, `git reset --hard` or `--no-verify` unless the user explicitly asks.
- Never commit secrets, DB dumps (`*.sql`, `*.dump`) or local settings (`.claude/settings.local.json`, `.env*`).
- A PR explains **what and why**, links the issue (`Closes #N`) and contains a verification plan.

## Branch hygiene

- A branch lives only until its PR is merged. After a merge, delete it both on the remote and locally; do not leave stale branches.
- After a PR is merged, run: `git checkout main && git pull --prune`, then delete the local branch (`git branch -d <name>`; squash merges make git warn "not fully merged" — compare with the merged PR before using `-D`).
- Periodically check for leftovers: `git branch --merged main` and `git branch -vv` (look for `[gone]` upstreams), plus `git branch -r` for old remote branches.
- Do not delete a branch that has unmerged work or an open PR, and never delete someone else's remote branch without asking.
- Repository setting (owner, one-time): enable "Automatically delete head branches" in GitHub Settings → General → Pull Requests, so merged remote branches disappear on their own.
