---
name: new-feature
description: End-to-end feature workflow — agreed spec → mockups chosen by the user → architecture plan → tests → implementation → review → docs → PR, delegating to specialist agents with hard confirmation gates. Use for any non-trivial feature.
argument-hint: "<feature description or spec/issue link>"
---

# /new-feature — a feature from idea to PR

Feature: **$ARGUMENTS**

Work in stages. Stages marked **GATE** are hard stops: do not continue until the user gives an explicit answer (use AskUserQuestion). Silence, earlier messages or agent reports never count as approval. Communicate with the user in Russian.

1. **Branch.** Make sure you are not on `main`; create `feat/<kebab-topic>` from an up-to-date `main`.
2. **Spec.** Run `/new-spec` (it runs the clarify → draft → review loop). If a spec already exists, show its status and summary. **GATE 1: spec status must be `approved` by the user.** Nothing below starts before this.
3. **Design (only if the feature has UI).** Run `/new-design`. **GATE 2: the user has chosen a variant** (recorded in the spec's decision log). Skip only if the user says the feature has no UI or declines mockups.
4. **Plan.** `architect` agent: affected layers and files, API/DTO contracts, DB schema, risks, whether an ADR is needed (`/new-adr`). For the DB involve `db-engineer`. Show the plan in a short form. **GATE 3: the user confirms the plan.**
5. **Tests first.** `qa-engineer`: a test plan from the acceptance criteria, then failing tests.
6. **Implementation.** `backend-dev` and/or `frontend-dev` (independent parts may run in parallel). `frontend-dev` builds to the chosen mockup variant. Migration — `/db-migration`. Goal: green tests. If something forces a deviation from the approved spec or design, **stop and ask** instead of deciding silently.
7. **Verification.** `/verify`.
8. **Review.** `/review`; fix blocker/major and re-run `/verify`.
9. **Documentation.** `/sync-docs` (spec status → `implemented`, CHANGELOG if needed).
10. **Commits and PR.** Conventional Commits, then `/pr`. **GATE 4: the user confirms publication.**

Rules: do not widen scope; never commit secrets; end every stage with a short "done / next" summary; if the user changes requirements mid-way, go back to the spec (stage 2) and re-agree before continuing.
