---
name: verify
description: Full project check before commit/PR — backend build and tests, frontend typecheck, lint and build. Run when you need to confirm everything is green, or before creating a PR.
allowed-tools: Bash(dotnet build:*), Bash(dotnet test:*), Bash(npm run:*), Bash(git status:*)
---

# /verify — project check

Run in order, stopping at the first failure, and report each step's result:

1. **Backend build** (warnings are errors): `dotnet build backend -nologo -v q`
2. **Backend tests** (if `backend/tests` exists): `dotnet test backend --no-build -nologo`
3. **Frontend typecheck** (from `frontend/`): `npm run typecheck`
4. **Frontend lint** (from `frontend/`): `npm run lint` — errors are not allowed; warnings (currently ~155) must not grow.
5. **Frontend build** (only if a full check was requested): `npm run build`

Finish with a table `step | result | time`. If something failed: show the key error lines, name the cause and propose a fix; **never claim "green" without running**. If there are no tests yet, say so. Write the report to the user in Russian.
