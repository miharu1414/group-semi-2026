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

## Dev Server — Startup and Health Check

Page layout breakage (no CSS, plain text) is almost always a dead or stale dev server, not a code bug. Follow this protocol every session.

### Check first
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# 200 = running, 000 = dead
```

### Restart when needed
```bash
pkill -f "next dev" 2>/dev/null; sleep 1
npm run dev > /tmp/nextdev.log 2>&1 &
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

### When to restart
| Situation | Action |
|---|---|
| Session start (server may have died) | Check first; restart if not 200 |
| After `npm install` | Always restart |
| After `npm run build` | Restart to clear `.next` cache |
| User reports broken/unstyled page | Restart immediately; tell user to Cmd+Shift+R |

### After restart
Always tell the user: **ブラウザで Cmd+Shift+R（Mac）/ Ctrl+Shift+R（Windows）でハードリロードしてください。**

Do not investigate CSS or Tailwind code until the server is confirmed healthy at HTTP 200.
