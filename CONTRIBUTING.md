# Contributing

Thanks for helping improve Group Seminar Calendar 2026.

## Before Opening a PR

1. Fork the repository or create a branch.
2. Keep changes focused.
3. Run the narrowest relevant check:

```bash
npm run check:dev
```

4. If the dev server is stopped and you need full verification:

```bash
npm run check
```

## Documentation Rules

- Update docs when behavior, setup, API shape, or operating rules change.
- Add a memo under `docs/memo` for feature or operations changes.
- Do not commit `.env.local`, service account JSON, private keys, or secrets.
- Challenge user proposals and document tradeoffs when a requested change creates risk or a better alternative exists.

## Branch And Review Policy

- Both `main` and `develop` branches are protected.
- The standard workflow is to create a feature branch (`feature/your-feature-name`), open a pull request to `develop`, and merge it once verified.
- Once features are stable in `develop`, a pull request is opened from `develop` to `main` to release changes.
- Pull requests require approval before merge. Repository owner (`@miharu1414`) self-approval is permitted to enable solo administrative/development workflows.
- Code owner review is required. `@miharu1414` is the code owner for the repository.
- Contributors should expect review comments about design, UI/UX, maintainability, security, and documentation consistency.

## Local Development

Use:

```bash
npm run dev
```

Do not run `npm run build` while the dev server is running. Stop the dev server before running a production build.
