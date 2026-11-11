---
paths:
  - "frontend/**/*.ts"
  - "frontend/**/*.tsx"
---

# Frontend: Next.js + MobX + MUI

- Перед работой с Next.js API прочитай нужный раздел в `frontend/node_modules/next/dist/docs/` — версия новее, чем в обучающих данных (см. `frontend/AGENTS.md`).
- Слои: компонент → store (MobX) → service (HTTP) → `service/httpService.ts`. Прямой `fetch` в компонентах и сторах запрещён.
- Базовый URL API — только `NEXT_PUBLIC_API_URL`; хосты в коде не хардкодить.
- Типы в `*.type.ts`, `any` не использовать (используй `unknown` + сужение или zod).
- Формы: `react-hook-form` + zod-схема; ошибки валидации показывать пользователю.
- Состояние загрузки/ошибки хранить в сторе (`isLoading`, `error`), а не глотать `console.error`.
- Стили: MUI `sx`/тема; SCSS-модули только там, где они уже есть.
- Серверные/клиентские границы: `'use client'` только там, где нужны хуки/браузерные API; не обращаться к `window`/`localStorage` во время SSR без проверки.
- Завершая задачу: `npm run typecheck && npm run lint` (из `frontend/`).
