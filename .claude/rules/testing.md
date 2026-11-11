---
paths:
  - "backend/tests/**"
  - "frontend/**/*.test.ts"
  - "frontend/**/*.test.tsx"
  - "frontend/**/*.spec.ts"
---

# Testing

- New logic comes with tests; a bug fix starts with a failing test that reproduces the bug.
- Backend: xUnit + FluentAssertions + NSubstitute. Names: `Method_Scenario_ExpectedResult`. Arrange / Act / Assert structure.
- Unit tests of `Domain`/`Application` must not touch the DB, network or clock (time goes through an abstraction).
- API integration tests use `WebApplicationFactory` + Testcontainers PostgreSQL; do not use EF InMemory as a Postgres substitute.
- Frontend: Vitest + Testing Library; test behavior (what the user sees, what the store does), not implementation.
- Tests are deterministic: no `sleep`, no dependence on test order or external services.
- Never weaken or delete a test to make the build green — find the cause first.
