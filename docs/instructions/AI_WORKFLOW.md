# AI Workflow

## Before Editing

1. Read the relevant files first.
2. Check whether the change touches UI, API, Firestore access, or documentation.
3. Keep changes scoped to the requested behavior.

## Implementation Checklist

- Reuse existing component and API patterns.
- Keep Firestore access server-side.
- Do not add deprecated database or setup code.
- Do not add personal setup scripts.
- Do not expose secrets in tracked files or final responses.
- Do not commit or push without explicit user instruction.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.

## Verification

Use the narrowest useful checks:

```bash
npm run lint
npm run build
```

Run `npm run build` when API routes, shared types, or configuration change.
