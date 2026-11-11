<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions (anime-quiz-trainer frontend)

- Stack: Next.js App Router, React 19, TypeScript `strict`, MobX (`makeAutoObservable`, `runInAction`), MUI 7, react-hook-form + zod 4.
- Layout: features live under `app/(ui)/<feature>/` with colocated `page.tsx`, `<feature>.service.ts` (HTTP), `<feature>.store.ts` (MobX), `<feature>.type.ts`, `<feature>.config.ts`. Shared UI in `app/(ui)/components/`.
- HTTP only through `service/httpService.ts`; endpoints are declared in `service/api.ts`. The API base URL comes from `NEXT_PUBLIC_API_URL` (see `.env.example`) — never hard-code hosts.
- Stores talk to services, components talk to stores. No `fetch` inside components.
- Validate forms with zod schemas; keep types in `*.type.ts`, avoid `any`.
- Do not store secrets in the frontend. Tokens currently live in `localStorage` (known limitation, see docs).
- Before finishing a task run: `npm run typecheck && npm run lint`.
