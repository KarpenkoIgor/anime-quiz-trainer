---
name: pr
description: Prepares a pull request — checks the branch, runs /verify, composes the description (what and why, test plan, issue link) and creates the PR via gh after confirmation. Use when work in a branch is finished.
argument-hint: "[issue number]"
disable-model-invocation: true
---

# /pr — pull request

Issue: **$ARGUMENTS** (if given).

1. Check the branch: not `main`/`master`; name `feat|fix|chore|docs/...`. Uncommitted changes — offer to commit them (Conventional Commits, `.claude/rules/git-workflow.md`).
2. Run `/verify`. If red, stop and report.
3. Gather context: `git log main..HEAD --oneline`, `git diff main...HEAD --stat`.
4. Compose a Conventional Commits title and a description:
   - **What and why** (2–4 points), **how to verify**, **risks/migrations**, `Closes #N`.
   - If applicable: were the spec/ADR/CHANGELOG updated.
5. Show the title and description to the user (in Russian explanation) and **ask for confirmation**.
6. After confirmation: `git push -u origin <branch>` and `gh pr create` (if `gh` is not installed, say so and give ready-to-paste PR text). Never bypass hooks (`--no-verify` is forbidden).
7. Output the PR link.
