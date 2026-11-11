---
paths:
  - "backend/src/**/*.cs"
  - "backend/src/**/appsettings*.json"
  - "frontend/service/**"
  - "frontend/Auth/**"
---

# Security

- Secrets (JWT key, connection strings, passwords, tokens) come only from the environment/user-secrets and never appear in the repository or logs. `appsettings.json` may contain only clearly local dev values.
- Outside Development the app must fail at startup on a weak/default `Jwt:SecretKey` (already implemented in `Program.cs`) — do not weaken this check.
- Every endpoint that mutates catalog data requires the admin role (`[Authorize(Policy = …)]`), not just `[Authorize]`.
- Validate user input at the boundary (DTO + attributes/validators); passwords use BCrypt; refresh tokens are stored hashed and rotated.
- Do not log tokens, passwords, full emails or personal data.
- SQL only through EF/parameters; `FromSqlRaw` with string concatenation is forbidden.
- CORS uses an explicit origin list from configuration, never `*`.
- Multiplayer (future): the server decides game results; never trust the client for score, timing or answer correctness.
- Frontend: no secrets in the bundle; tokens in `localStorage` are a known compromise — do not extend their use.
