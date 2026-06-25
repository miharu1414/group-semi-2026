# Security Policy

## Reporting Security Issues

Do not open public issues for secrets, credentials, access tokens, or vulnerabilities.

Use GitHub private vulnerability reporting:

https://github.com/miharu1414/group-semi-2026/security/advisories/new

## Secrets

Never commit:

- `.env.local`
- Firebase service account JSON files
- Private keys
- Access tokens

If a secret is exposed, rotate it immediately before continuing development.
