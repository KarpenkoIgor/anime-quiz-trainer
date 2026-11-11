---
paths:
  - "backend/tests/**"
  - "frontend/**/*.test.ts"
  - "frontend/**/*.test.tsx"
  - "frontend/**/*.spec.ts"
---

# Тесты

- Новая логика — с тестами; багфикс начинается с падающего теста, воспроизводящего баг.
- Backend: xUnit + FluentAssertions + NSubstitute. Имена: `Method_Scenario_ExpectedResult`. Структура Arrange / Act / Assert.
- Юнит-тесты `Domain`/`Application` не должны обращаться к БД, сети, часам (время — через абстракцию).
- Интеграционные тесты API — `WebApplicationFactory` + Testcontainers PostgreSQL; не использовать EF InMemory как замену Postgres.
- Frontend: Vitest + Testing Library; тестируем поведение (что видит пользователь, что делает store), не реализацию.
- Тесты детерминированы: без `sleep`, без зависимости от порядка и от внешних сервисов.
- Не ослаблять и не удалять тест, чтобы «позеленить» сборку — сначала разобраться в причине.
