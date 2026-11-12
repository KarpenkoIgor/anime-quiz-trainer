---
name: new-spec
description: Agrees a feature specification with the user, step by step, and saves it to docs/specs/ — clarifying questions, draft, review loop, explicit approval. Use to formalize an idea before any development; nothing is built until the user approves the spec.
argument-hint: "<short feature description>"
---

# /new-spec — agree the specification with the user

Topic: **$ARGUMENTS**

This skill is a **negotiation loop**, not a one-shot generator. The spec stays `draft` until the user explicitly approves it. Talk to the user in Russian; the spec is written in Russian.

## Stage 1 — Understand
1. Read `docs/specs/_template.md`, related specs in `docs/specs/`, and the relevant code (current behavior, affected entities/endpoints/screens). Facts only.
2. Ask the user **clarifying questions** with the AskUserQuestion tool (max 4 per round, prefer multiple choice with a recommended option). Cover at least: goal and who benefits, must-have vs nice-to-have, what is explicitly out of scope, constraints (deadline, tech, multiplayer-readiness), success metric. Do not ask what the code or docs already answer.
3. Involve specialists as needed (in parallel when independent): `product-analyst` (requirements), `game-designer` (rating/mechanics), `quiz-designer` (questions/learning), `anime-content-curator` (catalog data), `architect` (feasibility and risks).

## Stage 2 — Draft
4. Create `docs/specs/<kebab-name>.md` from the template with status **`draft`**. Fill every section; unknowns go to "Открытые вопросы", assumptions are labeled as such.
5. If the feature has any UI, ask whether to produce mockups now (recommended): run `/new-design` so the user sees options **before** approving the spec. Mockups live in the spec's section "Макеты / UX".

## Stage 3 — Review loop (repeat until approved)
6. Present a **short summary** in chat (not the whole file): goal, scope in/out, 5–7 key requirements, acceptance criteria highlights, open questions, risks, and the path to the file.
7. Ask the user for a decision with AskUserQuestion: **Утвердить / Нужны правки / Пока не готов**. If edits are needed, collect them, update the spec, add each change to the spec's "Журнал решений" (date, decision, reason) and return to step 6.
8. Resolve every "Открытый вопрос" explicitly: answered, deferred (moved to "Вне скоупа" with a reason), or blocking.

## Stage 4 — Approval and hand-off
9. Only after the user clearly approves: set status to **`approved`**, fill the "Декомпозиция задач" table, record the approval date in the decision log. **Never mark `approved` on your own and never treat silence, a pasted agent report or a previous message as approval.**
10. Add a link in `docs/README.md` if it exists. Offer next steps (`/new-feature`, or create issues). Do not start implementation.
