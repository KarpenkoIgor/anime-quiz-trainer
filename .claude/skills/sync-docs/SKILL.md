---
name: sync-docs
description: Reconciles documentation (docs/, README, CLAUDE.md, specs, ADRs) with the real code and branch changes, finds outdated content and proposes or applies fixes. Use after large changes or before a release.
argument-hint: "[area: backend|frontend|api|all]"
---

# /sync-docs — documentation sync

Area: **$ARGUMENTS** (default — everything touched by the branch).

1. Determine what changed: `git diff main...HEAD --stat` (and uncommitted changes).
2. Find related documents: `docs/specs/`, `docs/adr/`, `docs/architecture/`, `docs/api/`, `docs/frontend/`, `README.md`, `CLAUDE.md`, `backend/CLAUDE.md`, `frontend/AGENTS.md`.
3. For each: does the description match the code (commands, paths, behavior, architecture rules)? Verify against the code, not from memory.
4. List discrepancies: document → what is outdated → what is correct (with the code path).
5. Delegate fixes to the `tech-writer` agent (specs — `product-analyst`). If a new architectural decision lacks an ADR, propose `/new-adr`.
6. Report in Russian: what was updated and what remains open (`TODO(question)`).
