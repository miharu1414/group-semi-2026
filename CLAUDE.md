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
- Do not commit or push without explicit user instruction. (This applies to the immediate user prompt for each turn; never perform commits/pushes automatically based on past prompts).
- **Branch Synchronization Rule**: Always pull the latest changes on `main` and sync local `main` branch by running `git fetch origin` followed by `git checkout main && git rebase origin/main` before starting work or after merging pull requests to prevent branch drift.
- Do not run npm run build while the dev server is running.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- Challenge user proposals and document tradeoffs.
- Do not accept user proposals blindly; explain risks and suggest safer alternatives when appropriate.
- If architecture, DB, env vars, or setup steps change, update `docs/PROJECT_CONTEXT.json` and affected docs in the same change.

## Useful Commands

```bash
npm run check:dev
npm run docs:check
npm run lint
npm run typecheck
```

Stop the dev server before running:

```bash
npm run check
npm run build
```

## Before Finishing Work

1. Run the narrowest relevant check.
2. Run `npm run docs:check` when documentation or architecture assumptions changed.
3. Run `npm run check:dev` when code changed and the dev server is running.
4. Stop the dev server before running `npm run build` or `npm run check`.
5. Confirm no secret values were added to tracked files.
6. For UI changes, verify the app renders with CSS and the affected workflow still works.
