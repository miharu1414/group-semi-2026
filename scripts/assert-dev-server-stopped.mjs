import { isLocalDevPortOpen, localDevUrl } from './local-dev-guard.mjs';

if (!process.env.SKIP_DEV_SERVER_GUARD && await isLocalDevPortOpen()) {
  console.error(`Refusing to run a production build while port ${localDevUrl} is in use.`);
  console.error('Running next build and next dev against the same .next directory can break HMR chunks and make the UI render without CSS/JS.');
  console.error('Stop the dev server first, or run lint/type/docs checks without build while developing.');
  console.error('If this is intentional in CI or a non-dev environment, set SKIP_DEV_SERVER_GUARD=1.');
  process.exit(1);
}
