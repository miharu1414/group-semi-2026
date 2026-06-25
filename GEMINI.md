# Gemini Instructions

## First Read

作業前に必ず次を確認してください。

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

## Project

Group Seminar Calendar 2026 is a Next.js 14 + TypeScript + Tailwind CSS app backed by Firebase Admin SDK and Firestore.

## Rules

- Firestore access must stay in server-side API routes.
- Use Firebase Admin SDK through `lib/firebase-admin.ts`.
- Do not import Firebase Admin SDK from client components.
- Do not commit `.env.local`, service account JSON, private keys, or generated credential files.
- Do not restore deprecated database or setup assumptions.
- Do not commit or push without explicit user instruction.
- Do not run npm run build while the dev server is running.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- If architecture, DB, env vars, or setup steps change, update `docs/PROJECT_CONTEXT.json` and affected docs in the same change.

## Checks

```bash
npm run docs:check
npm run lint
npm run build
```
