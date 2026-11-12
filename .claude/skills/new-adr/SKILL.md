---
name: new-adr
description: Creates an architecture decision record (ADR) in docs/adr/ with a numbered filename from the template. Use when a significant technical decision is made or discussed (layers, storage, protocol, library, hosting).
argument-hint: "<decision topic>"
---

# /new-adr — architecture decision

Topic: **$ARGUMENTS**

1. Determine the next number: look at `docs/adr/NNNN-*.md`, take the maximum + 1 (4 digits).
2. Read `docs/adr/0000-template.md` and the code/docs on the topic — facts, not guesses.
3. Involve the `architect` agent for options and a recommendation (at least 2 options with pros/cons).
4. Create `docs/adr/NNNN-<kebab-case>.md` with status `proposed` (or `accepted` if the decision was already agreed with the user). The ADR text is written in Russian (human-facing).
5. Add a link in `docs/README.md`/the ADR index if present.
6. Report (in Russian): number, the decision in one line, consequences. Ask for confirmation of `accepted` status if it was not given.
