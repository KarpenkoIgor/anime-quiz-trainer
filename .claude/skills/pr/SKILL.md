---
name: pr
description: Готовит pull request — проверяет ветку, прогоняет /verify, формирует описание (что и зачем, план проверки, ссылка на issue) и создаёт PR через gh после подтверждения. Используй, когда работа в ветке закончена.
argument-hint: "[номер issue]"
disable-model-invocation: true
---

# /pr — pull request

Issue: **$ARGUMENTS** (если указан).

1. Проверь ветку: не `main`/`master`; имя `feat|fix|chore|docs/...`. Незакоммиченные изменения — предложи закоммитить (Conventional Commits, `.claude/rules/git-workflow.md`).
2. Запусти `/verify`. Если красное — остановись и сообщи.
3. Собери контекст: `git log main..HEAD --oneline`, `git diff main...HEAD --stat`.
4. Сформируй заголовок в формате Conventional Commits и описание:
   - **Что и зачем** (2–4 пункта), **как проверить**, **риски/миграции**, `Closes #N`.
   - Если применимо: обновлены ли спека/ADR/CHANGELOG.
5. Покажи заголовок и описание пользователю и **спроси подтверждение**.
6. После подтверждения: `git push -u origin <ветка>` и `gh pr create` (если `gh` не установлен — сообщи и дай готовый текст PR для ручного создания). Хуки не обходить (`--no-verify` запрещён).
7. Выведи ссылку на PR.
