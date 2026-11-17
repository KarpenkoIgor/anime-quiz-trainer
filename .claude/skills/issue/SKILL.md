---
name: issue
description: Creates GitHub issues from a spec's task breakdown or from a short description — with labels, size, spec links and dependencies — after the user confirms the list. Use after a spec is approved, or when someone names a task, bug or discussion topic.
argument-hint: "<spec path | short description>"
disable-model-invocation: true
---

# /issue — tasks on GitHub

Source: **$ARGUMENTS**. Talk to the user in Russian. **Everything on GitHub issues (titles, bodies, comments, labels) is written in English**, like commits and PRs; link to Russian specs by file path and translate what you quote. Process: `docs/process.md`.

1. Read the source. For a spec, take the table in section "Декомпозиция задач" (skip tasks already done or deferred). For a short description, pick the form: `Task`, `Bug`, `Idea` or `Discussion topic` (templates in `.github/ISSUE_TEMPLATE/`).
2. Check for duplicates: `gh issue list --state all --search "<keywords>"`.
3. Per issue compose (in English): title (short, imperative or noun phrase, no ticket numbers), body in the template's structure (why and what, spec path with AC/FR numbers, definition of done, size, dependencies as `#N`), labels (type + `area:*` + `size:*`).
4. Show the list (title, labels, size) to the user and **ask for confirmation** before creating anything: issues are visible to the whole team.
5. Check that the labels exist (`gh label list`); create missing ones only after the user agrees.
6. Create in dependency order with `gh issue create`, collecting the numbers. For several tasks of one spec also create an overview issue with a checklist `- [ ] #N`.
7. Add each issue to the project board: `gh project item-add 2 --owner KarpenkoIgor --url <issue url>` (needs the `project` scope; if missing, give the user `! gh auth refresh -s project`).
8. Record the issue numbers in the spec's task table (a column or a line "Задачи: #N–#M"); never renumber existing tasks.
9. If `gh` is missing or not authenticated, say so and give ready-to-paste issue text instead.
