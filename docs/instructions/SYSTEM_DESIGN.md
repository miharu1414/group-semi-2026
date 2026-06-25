# System Design

## Architecture

```text
Browser
  -> Next.js App Router
  -> API route handlers
  -> Firebase Admin SDK
  -> Firestore
```

## Data Access

- Initialize Firebase Admin in `lib/firebase-admin.ts`.
- API routes import `db` from `@/lib/firebase-admin`.
- Client components call local API routes with `fetch`.
- Client components must not import Firebase Admin SDK.

## Environment

Required server-side environment variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

`FIREBASE_PRIVATE_KEY` is stored as a single-line value with escaped `\n`.

## Deployment

The app should run on a Node.js-capable Next.js host such as Vercel. Firebase Admin SDK requires server-side runtime support.
