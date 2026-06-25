# 2026-06-25 critical-review-governance

## Implemented

- Added a rule requiring AI agents to challenge user proposals and document tradeoffs.
- Added the same rule to `docs/PROJECT_CONTEXT.json`, `docs/GOVERNANCE.md`, `CLAUDE.md`, `GEMINI.md`, `INSTRUCTIONS.md`, Copilot instructions, Cursor rules, and `docs/instructions`.
- Updated `npm run docs:check` to fail when core AI instruction files contain mojibake text.
- Rewrote `docs/instructions/AI_WORKFLOW.md` so the dev-server guidance matches the current `npm run dev`, `check:dev`, and build guard behavior.

## Rationale

Multiple AI tools will work against the same repository. They need a shared rule that the latest user request is important but not automatically correct. The agent should surface risks, alternatives, and future improvements before implementing when a request could create maintenance, security, or UX problems.

## Future Improvements

- Add a pull request template with explicit sections for risks, alternatives considered, and follow-up work.
- Add a lightweight architecture decision checklist for changes that affect data model, deployment, or user-facing workflows.
- Consider a small docs linter for known mojibake patterns across all Markdown once older legacy documents are fully cleaned.
