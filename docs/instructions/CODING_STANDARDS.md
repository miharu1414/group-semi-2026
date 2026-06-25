# Coding Standards

## TypeScript

- Prefer explicit domain types from `lib/types.ts`.
- Avoid `any`; use `unknown` or a specific type.
- Keep API validation close to each route handler.

## API Routes

- Use `Response.json(...)`.
- Catch errors at the route boundary and return a generic 500 response.
- Log server-side errors with enough route context to debug.
- Access Firestore only through `db` from `@/lib/firebase-admin`.

## React

- Keep UI state in the nearest practical component.
- Keep presentational calendar pieces under `components/Calendar`.
- Keep modal workflows under `components/Modals`.

## Secrets

- Never place secrets in tracked files.
- Never commit Firebase service account JSON files.
- `.env.local` is for local development only.
