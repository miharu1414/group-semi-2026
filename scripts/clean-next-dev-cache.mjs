import fs from 'node:fs';
import path from 'node:path';
import { isLocalDevPortOpen, localDevUrl } from './local-dev-guard.mjs';

const nextDir = path.join(process.cwd(), '.next');

if (await isLocalDevPortOpen()) {
  console.error(`Port ${localDevUrl} is already in use.`);
  console.error('Stop it before starting another dev server, so the .next HMR cache is not corrupted.');
  process.exit(1);
}

fs.rmSync(nextDir, { recursive: true, force: true });
console.log('Cleared .next before starting the hot-reload dev server.');
