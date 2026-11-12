---
paths:
  - "frontend/**/*.ts"
  - "frontend/**/*.tsx"
---

# Frontend: Next.js + MobX + MUI

- Before using any Next.js API, read the relevant guide in `frontend/node_modules/next/dist/docs/` — this version is newer than the model's training data (see `frontend/AGENTS.md`).
- Layers: component → store (MobX) → service (HTTP) → `service/httpService.ts`. Direct `fetch` in components and stores is forbidden.
- The API base URL comes only from `NEXT_PUBLIC_API_URL`; never hard-code hosts.
- Types live in `*.type.ts`; do not use `any` (use `unknown` + narrowing, or zod).
- Forms: `react-hook-form` + a zod schema; show validation errors to the user.
- Keep loading/error state in the store (`isLoading`, `error`) instead of swallowing it with `console.error`.
- Styling: MUI `sx`/theme; SCSS modules only where they already exist.
- Server/client boundary: `'use client'` only where hooks/browser APIs are needed; never touch `window`/`localStorage` during SSR without a guard.
- When finishing a task run `npm run typecheck && npm run lint` (from `frontend/`).
