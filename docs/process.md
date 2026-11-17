# Процесс работы: задачи, ветки, PR

Источник правды о том, что делается прямо сейчас: **GitHub Issues** репозитория. Документация (`docs/`) описывает «что и почему», задачи на GitHub описывают «что делаем сейчас». Правила веток и коммитов: `.claude/rules/git-workflow.md`.

## Путь задачи

```
идея → docs/ideas.md (скилл /idea; при необходимости issue «Idea»)
  → обсуждение (issue «Discussion topic») → спека docs/specs/<имя>.md (approved)
  → макет (если есть экран) → план architect (ADR)
  → декомпозиция в спеке → задачи на GitHub (скилл /issue)
  → ветка feat/<тема> → тесты → код → /verify → /review
  → PR с «Closes #N» → CI → squash-merge → ветка удаляется
```

Нетривиальную фичу целиком ведёт `/new-feature`; `/issue` вызывается после утверждения спеки.

## Задачи (issues)

**Правило: заголовки, описания, комментарии и метки задач пишутся на английском** (как коммиты и PR). Спеки и документы остаются на русском, в задаче на них ссылаются по пути, цитаты переводятся.

Создаются из шаблонов `.github/ISSUE_TEMPLATE/`: **Task**, **Bug**, **Idea**, **Discussion topic**. Пустые задачи отключены.

- Задача = одна ветка = один PR. Больше нескольких дней работы: разрезать.
- В теле: зачем, путь к спеке (`docs/specs/...`, номера AC/FR), критерий готовности, размер, зависимости (`#N`).
- Задачи по спеке создаёт скилл `/issue` из таблицы «Декомпозиция задач»; общая задача-обзор со списком `- [ ] #N` собирает прогресс.

## Доска

GitHub Project «anime-quiz-trainer» (№2, привязан к репозиторию): https://github.com/users/KarpenkoIgor/projects/2. Колонки Todo / In Progress / Done. `/issue` добавляет новые задачи на доску (`gh project item-add 2 --owner KarpenkoIgor --url <issue>`), они попадают в Todo. Когда берёте задачу в работу, переведите её в In Progress и поставьте метку `status:in-progress`; PR с `Closes #N` закрывает задачу при слиянии, и встроенный процесс доски переносит её в Done. Доступ второму участнику выдаётся в настройках проекта (Settings → Manage access).

### Метки

| Группа | Метки |
|---|---|
| Тип | `enhancement` (фича), `bug`, `documentation`, `idea`, `discussion` |
| Область | `area:backend`, `area:frontend`, `area:db`, `area:infra`, `area:docs`, `area:claude` |
| Размер | `size:S`, `size:M`, `size:L` |
| Статус | `status:in-progress`, `status:blocked`, `status:deferred` |

Отсутствующие метки `/issue` предлагает создать и создаёт только с вашего согласия.

## Ветки и коммиты

Trunk-based, Conventional Commits, squash-merge: см. `.claude/rules/git-workflow.md`. Когда несколько человек или агентов работают в одном рабочем дереве, коммитьте только свои файлы по явным путям.

## Pull request

Создаётся скиллом `/pr`: проверка ветки, `/verify`, описание по шаблону `.github/pull_request_template.md` (что и зачем, как проверить, риски, `Closes #N`), подтверждение, пуш ветки, `gh pr create`.

До слияния зелёным должен быть CI (`.github/workflows/ci.yml`): backend build + test, frontend typecheck + lint, плюс чек-лист из шаблона PR.

## После слияния

```
git checkout main && git pull --prune
git branch -d <ветка>
```

Squash-слияние заставит git предупредить «not fully merged»: сверьте с PR и только тогда используйте `-D`.
