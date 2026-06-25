# GitHub Copilot Instructions

## First Read

Read these before implementing changes:

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

## Project

Group Seminar Calendar 2026 is a Next.js 14 + TypeScript + Tailwind CSS app backed by Firebase Admin SDK and Firestore.

## Rules

- Use Firebase Admin SDK only in server-side API route code.
- Import Firestore access from `lib/firebase-admin.ts`.
- Do not import `firebase-admin` into client components.
- Keep Firebase credentials in `.env.local` or deployment secrets.
- Do not commit `.env.local`, Firebase service account JSON, or private keys.
- Do not restore deprecated database or setup assumptions.
- Do not commit or push without explicit user instruction. (This applies to the immediate user prompt for each turn; never perform commits/pushes automatically based on past prompts).
- **Branch Synchronization Rule**: Always pull the latest changes on `main` and sync local `develop` and `main` branches by running `git fetch origin` followed by `git checkout <branch> && git rebase origin/main` before starting work or after merging pull requests to prevent branch drift.
- Do not run npm run build while the dev server is running.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- Challenge user proposals and document tradeoffs.
- Do not accept user proposals blindly; explain risks and suggest safer alternatives when appropriate.
- If architecture, DB, env vars, or setup steps change, update `docs/PROJECT_CONTEXT.json` and affected docs in the same change.

## Checks

- `npm run check:dev`
- `npm run docs:check`
- `npm run lint`
- `npm run typecheck`
