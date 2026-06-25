# 2026-06-25 public-repo-pr-issue-policy

## Implemented

- Added `CODEOWNERS` so all files are owned by `@miharu1414`.
- Added pull request and issue templates.
- Added `CONTRIBUTING.md` with review, documentation, and branch policy.
- Added `SECURITY.md` for private vulnerability reporting and secret handling.

## Intended GitHub Settings

- Repository visibility: public.
- Issues: enabled.
- Pull requests from external contributors: accepted through the normal public fork workflow.
- `main` branch: protected.
- Pull request required before merge.
- Code owner review required.
- CODEOWNERS owner: `@miharu1414`.

## Critical Notes

- Making the repository public does not require giving other members write access.
- If collaborators with write access are added later, code owner review keeps final approval with `@miharu1414`.
- Branch protection should be checked after every major repository permission change.
- Previously exposed Firebase service account keys should be rotated before relying on public repository safety.
