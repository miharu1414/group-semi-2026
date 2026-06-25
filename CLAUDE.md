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

## Dev Server Management

The dev server must be explicitly started and kept healthy. CSS/style breakage is almost always a stale or dead server process.

**Checking the server:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# 200 = healthy, 000 = not running
```

**Starting (or restarting) the server:**
```bash
pkill -f "next dev" 2>/dev/null; sleep 1
npm run dev > /tmp/nextdev.log 2>&1 &
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

**Rules:**
- Always restart after `npm install` — new `node_modules` require a fresh server.
- Always restart after a session gap — the background process may have died.
- **`npm run build` kills the dev server.** Always restart after running a build.
- After restarting, tell the user to hard-refresh the browser: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows).
- If the page renders without CSS (plain text, no layout), that is a dead/stale server. Restart first before investigating code.
- After a restart, confirm the server is healthy (HTTP 200) before reporting the task done.

## Before Finishing Work

1. Run the narrowest relevant check.
2. Run `npm run docs:check` when documentation or architecture assumptions changed.
3. Run `npm run build` when API, shared types, or config changed.
4. **If `npm run build` was executed for any reason, always restart the dev server afterward.**
5. Confirm no secret values were added to tracked files.
6. Confirm the dev server is running and returns HTTP 200.
7. **Visually verify the app renders correctly before commit/push.**
   - Check http://localhost:3000 renders with full CSS (not plain text).
   - If any CSS/layout changes were made, confirm the calendar grid, header, modals, and NoticeBoard appear styled.
   - If the page renders as unstyled plain text: restart the dev server, then hard-refresh.
