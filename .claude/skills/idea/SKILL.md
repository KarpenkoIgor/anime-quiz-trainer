---
name: idea
description: Records a new product idea or requirement in docs/ideas.md in the author's wording, filed under the right section, and notes follow-ups (spec, ADR, issue). Use whenever someone on the team shares a product idea or requirement.
argument-hint: "<the idea>"
---

# /idea — log an idea

Idea: **$ARGUMENTS**

1. Read `docs/ideas.md`; find the matching section or add a short new one. Keep the author's wording, append, never reorder or delete other people's entries.
2. If it contradicts or refines an existing item, mark it explicitly instead of silently overwriting.
3. Treat the example as a special case of a general mechanism; note the general form in one line.
4. If it affects scope or needs a decision, say so and offer `/new-spec`, `/new-adr` or an `Idea` issue (`/issue`). Do not start building.
5. Reply in Russian in two lines: where it was recorded and the suggested next step.
6. The edit goes through the normal branch flow (`docs/…` branch, PR); never commit to `main`.
