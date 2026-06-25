# Instructions Index

This directory contains working rules for AI-assisted development.

## Project Summary

Group Seminar Calendar 2026 manages seminar schedules and member assignments.

Current stack:

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase Admin SDK
- Firestore

## Read Order

1. `../GOVERNANCE.md`
2. `../PROJECT_CONTEXT.json`
3. `../ARCHITECTURE.md`
4. `SYSTEM_DESIGN.md`
5. `DATA_MODEL.md`
6. `CODING_STANDARDS.md`
7. `DESIGN_RULES.md`
8. `AI_WORKFLOW.md`

## Important Constraints

- Firestore access stays in server-side API routes.
- Firebase Admin SDK is initialized in `lib/firebase-admin.ts`.
- Secrets stay in `.env.local` or deployment platform secrets.
- Do not commit Firebase service account JSON files.
- Do not commit or push without explicit user instruction.
- Do not run npm run build while the dev server is running.
- Feature and operations changes must leave a dated memo under `docs/memo`.
- Challenge user proposals and document tradeoffs.
- Do not accept user proposals blindly; explain risks and alternatives when appropriate.
- Run `npm run docs:check` when documentation or architecture assumptions change.
