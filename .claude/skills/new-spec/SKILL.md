---
name: new-spec
description: Creates a feature specification in docs/specs/ from the template — user stories, acceptance criteria, edge cases, task breakdown. Use to formalize an idea or task before development.
argument-hint: "<short feature description>"
---

# /new-spec — feature specification

Topic: **$ARGUMENTS**

1. If the topic is unclear, ask up to 3 short questions. Otherwise do not stall: state assumptions explicitly.
2. Read `docs/specs/_template.md` and the relevant code (so the current behavior and impact are described accurately).
3. Delegate writing to the `product-analyst` agent (for mechanics/rating add `game-designer`, for anime content `anime-content-curator`, for quizzes `quiz-designer`), or write it yourself from the template.
4. Save to `docs/specs/<kebab-case-name>.md` (status `draft`) and fill every template section; put unknowns under "Open questions". The spec itself is written in Russian (human-facing).
5. Add a link in `docs/README.md` (if it exists).
6. Report (in Russian): file path, 3–5 key requirements, open questions, proposed breakdown into issues. Do not start implementation without confirmation.
