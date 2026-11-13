---
name: retro
description: End-of-session retrospective — reviews what was done, finds where the user corrected, rejected or re-explained something, which agents/skills helped or got in the way, and proposes concrete improvements to rules, agents, skills, docs and memory. Use at the end of a work session or after a long task.
argument-hint: "[focus: agents|process|docs|all]"
disable-model-invocation: true
---

# /retro — session retrospective

Focus: **$ARGUMENTS** (default — everything). Communicate with the user in Russian. This skill only analyses and proposes; it changes nothing until the user approves a specific item.

## 1. Collect facts (no opinions yet)

- What was requested and what was delivered: `git log main..HEAD --oneline`, `git status --short`, PRs opened/merged in the session (`gh pr list --author @me --limit 5`).
- Re-read the conversation of this session and list **friction moments** with a short quote or paraphrase of what the user said:
  - the user rejected a tool call or a plan, or redirected ("не так", "убираем", "это не нужно");
  - the user repeated or re-explained a requirement;
  - something had to be redone, retried or abandoned (failed commands, wrong assumption, a claim later corrected);
  - questions asked that could have been answered from the repo, or decisions taken without asking when they were the user's to make;
  - work that went beyond what was asked (scope creep) or stopped short of it.
- Agents and skills used: which ones, for what, and whether their result was used as is, corrected or ignored. Note agents that should have been used but were not, and ones that were not needed.
- Gates and process: were the `/new-feature` gates respected, was `/verify` run before "done", were secrets and `main` protected.

## 2. Classify

For every friction moment decide the cause: **missing/unclear rule** (belongs in `.claude/rules/` or `CLAUDE.md`), **agent or skill prompt gap** (belongs in `.claude/agents/` or `.claude/skills/`), **environment/tooling** (permissions, missing CLI, network), **user preference** (belongs in memory), or **one-off** (no action). Do not blame the user; if the cause is unclear, say so.

## 3. Report (short, Russian)

1. **Итог:** 3–5 строк — что сделано, что осталось.
2. **Что сработало хорошо** — 2–4 пункта (повторять).
3. **Где были трения** — таблица: момент → причина → класс.
4. **Что подсветить команде** — решения, риски и открытые вопросы, о которых остальным важно знать (не секреты, не личные данные).
5. **Предложения** — нумерованный список конкретных правок: файл → что добавить/изменить → зачем. Не больше 7, самые полезные первыми.

## 4. Act only on approval

Ask which numbered proposals to apply (AskUserQuestion, multi-select). Then:
- rules, agents, skills, docs — make the change on a `chore/…` or `docs/…` branch, never on `main`; commit and PR only after the usual confirmation;
- user preferences and working-style feedback — save to memory (check for an existing file first, update instead of duplicating);
- product or tooling defects in Claude Code itself — offer to draft feedback, do not send without approval.

Rules: base every statement on what actually happened in the session; no invented complaints; keep personal data out of anything written to the repo; end with a one-line "done / next".
