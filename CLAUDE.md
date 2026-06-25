# Claude Instructions

## First Read

Before changing code or documentation, read:

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

## Project

Group Seminar Calendar 2026 is a Next.js 14 + TypeScript + Tailwind CSS app for managing seminar schedules and member assignments.

## Current Architecture

- Frontend: Next.js App Router + React components
- API: Next.js route handlers under `app/api`
- Database: Firestore
- Server SDK: Firebase Admin SDK
- Firebase initialization: `lib/firebase-admin.ts`

## Required Rules

- Use Firebase Admin SDK only in server-side code.
- Do not import `firebase-admin` from client components.
- Read Firestore through `lib/firebase-admin.ts`.
- Keep secrets in `.env.local` or deployment platform environment variables.
- Never commit `.env.local`, Firebase service account JSON files, private keys, or generated credential files.
- Do not add personal setup scripts such as `.ps1` or `.bat`.
- Do not commit or push without explicit user instruction.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- If architecture, DB, env vars, or setup steps change, update `docs/PROJECT_CONTEXT.json` and the affected docs in the same change.

## Useful Commands

```bash
npm run docs:check
npm run lint
npm run build
```

## Before Finishing Work

1. Run the narrowest relevant check.
2. Run `npm run docs:check` when documentation or architecture assumptions changed.
3. Run `npm run build` when API, shared types, or config changed.
4. Confirm no secret values were added to tracked files.
