---
name: new-feature
description: End-to-end feature workflow — spec → architecture plan → tests → implementation → review → docs → PR, delegating to specialist agents with confirmation checkpoints. Use for any non-trivial feature.
argument-hint: "<feature description or spec/issue link>"
---

# /new-feature — a feature from idea to PR

Feature: **$ARGUMENTS**

Work in stages; at those marked ⏸ stop and wait for the user's confirmation. Communicate with the user in Russian.

1. **Branch.** Make sure you are not on `main`; create `feat/<kebab-topic>` from an up-to-date `main`.
2. **Spec.** Is there a `docs/specs/<feature>.md`? If not, run `/new-spec`. ⏸ Confirm the spec.
3. **Plan.** `architect` agent: affected layers and files, API/DTO contracts, DB schema, risks; whether an ADR is needed (`/new-adr`). For the DB involve `db-engineer`. ⏸ Confirm the plan.
4. **Tests first.** `qa-engineer`: a test plan from the acceptance criteria and failing tests.
5. **Implementation.** `backend-dev` and/or `frontend-dev` (independent parts may run in parallel). Migration — `/db-migration`. Goal: green tests.
6. **Verification.** `/verify`.
7. **Review.** `/review`; fix blocker/major and re-run `/verify`.
8. **Documentation.** `/sync-docs` (spec status → `implemented`, CHANGELOG if needed).
9. **Commits and PR.** Conventional Commits, then `/pr`. ⏸ Confirm publication.

Rules: do not widen scope; never commit secrets; end every stage with a short "done / next" summary.
