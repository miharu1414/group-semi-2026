# AI Workflow

## Before Editing

1. Read the relevant files first.
2. Check whether the change touches UI, API, Firestore access, documentation, or operations.
3. Identify the actual user goal, not only the literal requested implementation.
4. Keep changes scoped to the requested behavior unless a broader fix is needed to prevent regression.

## Critical Review Policy

- Challenge user proposals and document tradeoffs.
- Do not accept user proposals blindly.
- If a request introduces risk, explain the risk and suggest a safer alternative.
- If multiple approaches are viable, prefer the one that is simpler, more maintainable, and consistent with the existing system.
- Preserve explicitly requested product behavior unless there is a concrete reason to challenge it.

## Implementation Checklist

- Reuse existing component and API patterns.
- Keep Firestore access server-side.
- Do not add deprecated database or setup code.
- Do not add personal setup scripts.
- Do not expose secrets in tracked files or final responses.
- Do not commit or push without explicit user instruction.
- Do not run npm run build while the dev server is running.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.

## Verification

Use checks that match the current server state.

Safe while the dev server is running:

```bash
npm run check:dev
```

Full verification, only after stopping the dev server:

```bash
npm run check
```

Run `npm run docs:check` when documentation or architecture assumptions change.

## Dev Server

- Use `npm run dev` for local hot reload.
- `npm run dev` clears `.next` before starting so stale HMR chunks do not break local UI.
- Stop the dev server before `npm run build` or `npm run check`.
- If the local UI appears unstyled or chunks return 404, restart with `npm run dev` and hard-refresh the browser.
- Do not debug Tailwind or layout code until the server is confirmed healthy.
