# Documentation Governance

This repository treats documentation as a checked engineering contract, not as loose notes. Humans and AI agents should use the same source of truth before changing code, UI, data models, deployment behavior, or operating rules.

## Source Of Truth

Start with `docs/PROJECT_CONTEXT.json`.

It records the current stack, runtime assumptions, source-of-truth files, required environment variables, deprecated assumptions, and operational rules. If implementation and documentation disagree, update one or both in the same change.

## Read Order

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`
5. Code and docs closest to the task

## Non-Negotiable Rules

- Do not commit or push without explicit user instruction. (This applies to the immediate user prompt for each turn; never perform commits/pushes automatically based on past prompts).
- **Branch Synchronization Rule**: Always pull the latest changes on `main` and sync the local `main` branch by running `git fetch origin` followed by `git checkout main && git rebase origin/main` before starting work or after merging pull requests to prevent branch drift.
- Do not run npm run build while the dev server is running.
- Use `npm run dev` for local hot reload.
- When implementing a feature or changing project operations, add a memo under `docs/memo` named `YYYY-MM-DD-kebab-case-summary.md`.
- Challenge user proposals and document tradeoffs.
- Do not accept a requested implementation blindly when a safer, simpler, or more maintainable option exists.
- If you disagree with a request, explain the risk and propose a practical alternative before implementing.

## Change Rules

- If architecture, database, deployment target, environment variables, or setup steps change, update `docs/PROJECT_CONTEXT.json`.
- If API shape or data fields change, update `docs/ARCHITECTURE.md` and `docs/instructions/DATA_MODEL.md`.
- If setup steps change, update `README.md` and `docs/SETUP.md`.
- If AI operating rules change, update `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursor/rules/main.mdc`, and `INSTRUCTIONS.md`.
- Record major design decisions as ADRs under `docs/decisions/`.

## Checks

For checks that are safe while the dev server is running:

```bash
npm run check:dev
```

For a full local verification, stop the dev server first, then run:

```bash
npm run check
```

GitHub Actions runs the `Quality Gate` on pull requests and pushes to `main`.

`npm run docs:check` verifies:

- Required canonical docs exist.
- AI entry docs reference `docs/GOVERNANCE.md` and `docs/PROJECT_CONTEXT.json`.
- AI entry docs include commit / push permission rules.
- AI entry docs include the `docs/memo` rule.
- AI entry docs include the dev-server/build safety rule.
- AI entry docs include the critical-review rule.
- Current stack terms appear in major docs.
- Deprecated assumptions have not reappeared.
- Firebase Admin SDK environment variables appear in `.env.example` and setup docs.

## Review Standard

Prioritize correctness and maintainability over simply satisfying the latest prompt.

Review changes for:

- Implementation and documentation consistency.
- Executable setup steps.
- API boundaries that reject invalid or unexpected input.
- UI that remains usable on mobile and desktop.
- Secret handling.
- Clear commit / push conditions.
- Memos under `docs/memo` for implemented work.
- Explicit risks, tradeoffs, alternatives, and future improvements when relevant.
