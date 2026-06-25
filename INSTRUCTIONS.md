# INSTRUCTIONS.md

This is the entry point for AI agents working in this repository.

## First Read

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

## Current Implementation Policy

- Use Next.js 14 App Router.
- Use Firebase Admin SDK only from server-side API routes.
- Persist data in Firestore.
- Store Firebase service account values in `.env.local`; never commit them.
- Do not add personal setup scripts such as `.ps1` or `.bat`.
- Do not commit or push without explicit user instruction.
- Do not run npm run build while the dev server is running.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- Challenge user proposals and document tradeoffs.
- Do not accept user proposals blindly; explain risks and suggest safer alternatives when appropriate.
- If architecture, DB, env vars, or setup steps change, update `docs/PROJECT_CONTEXT.json` and affected docs in the same change.

## Auto-Read Files

| Tool | File |
| --- | --- |
| Claude Code | `CLAUDE.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/main.mdc` |
| Gemini CLI | `GEMINI.md` |

## Consistency Check

```bash
npm run docs:check
```
