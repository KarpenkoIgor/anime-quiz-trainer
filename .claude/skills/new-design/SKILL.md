---
name: new-design
description: Produces mockup proposals for a feature (two alternatives with text wireframes and openable HTML previews) via the ui-designer agent, so the user can choose how it will look before development. Use for any feature with UI, usually from /new-spec or /new-feature.
argument-hint: "<feature name or spec path>"
---

# /new-design — show how it will look, let the user choose

Feature: **$ARGUMENTS**

Talk to the user in Russian.

1. Find the spec `docs/specs/<feature>.md` (from the argument or by searching). If none exists, run `/new-spec` first or ask the user for a short description; do not design in a vacuum.
2. Delegate to the `ui-designer` agent with a **self-contained brief**: spec path, goal, key screens/states, constraints from the spec, existing app conventions (point to `frontend/app/(ui)/` and the theme), and the deliverables required by its definition (2 variants, text wireframes in the spec section "Макеты / UX", HTML previews in `docs/design/<feature>/`).
3. When the agent returns, verify that the files exist and that the HTML previews are self-contained (no external URLs).
4. Present to the user: where to open the previews (full paths), a 3-line description of each variant, the comparison table and the designer's recommendation.
5. Ask for the decision with AskUserQuestion: **Вариант A / Вариант B / Смесь (опишу) / Нужны правки**. On "needs changes" collect feedback, re-run the designer with it, and repeat.
6. Record the decision in the spec's "Журнал решений": chosen variant, rejected alternative, reasons, requested tweaks. Mark the chosen variant as the build reference.
7. Never decide for the user, never edit `frontend/` code, never mark the design chosen without an explicit answer.
