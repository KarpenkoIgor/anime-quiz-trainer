## What and why

<!-- 2-4 points in plain words -->

Closes #

## How to verify

<!-- commands and steps: dotnet build backend, dotnet test backend, npm run typecheck && npm run lint, what to open in the app -->

## Risks and migrations

<!-- DB schema, API contract, config/env changes; "none" if none -->

## Checklist

- [ ] `dotnet build backend` is clean, tests pass (when the change touches the backend)
- [ ] `npm run typecheck` and `npm run lint` are clean (when the change touches the frontend)
- [ ] New logic has tests; a bug fix starts with a test that reproduces it
- [ ] Spec (`docs/specs/`), ADR (`docs/adr/`) and `docs/ideas.md` updated if behavior or decisions changed
- [ ] No secrets, dumps or local settings in the diff
