---
name: review
description: Comprehensive review of current changes — runs the code-reviewer and security-reviewer agents in parallel and merges findings by severity. Use before a PR or after a large change.
argument-hint: "[branch/commit/path — defaults to the current diff]"
---

# /review — change review

Review target: **$ARGUMENTS** (if empty — uncommitted changes and the branch's commits relative to `main`).

1. Determine the scope: `git status`, `git diff --stat`, `git diff main...HEAD --stat`. If there are no changes, say so and stop.
2. **In parallel** (one message) launch the `code-reviewer` and `security-reviewer` agents, giving them the change scope and pointing to `CLAUDE.md` and `.claude/rules/`. If `frontend/` is touched, mention the frontend rules; if the DB schema is touched, also involve `db-engineer`.
3. Merge the results: remove duplicates, sort by severity (blocker → major → minor → nit); each item has `file:line` and a fix.
4. Report in Russian: verdict (ready for PR / changes needed), blocker/major list, then the rest. Do not make fixes unless the user asks.
