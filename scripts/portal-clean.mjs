import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const targets = [
  path.join(repoRoot, 'node_modules'),
  path.join(repoRoot, '.pnp.cjs'),
  path.join(repoRoot, '.pnp.loader.mjs'),
];

function rmrf(p) {
  try {
    fs.rmSync(p, {recursive: true, force: true});
    // eslint-disable-next-line no-empty
  } catch {}
}

for (const t of targets) rmrf(t);

console.log(
  [
    '[portal:clean] Removed local install artifacts from react-native-calendars.',
    '- node_modules/',
    '- .pnp.cjs / .pnp.loader.mjs (if present)',
    '',
    'Portal invariant: keep this repo free of node_modules/ while consumed via Yarn portal:.',
    '',
    'Maintainer note: after portal:clean, local commands like `yarn lint`, `yarn test`, and `yarn build` in this clone will fail until you run `yarn` again.',
    'Use a separate maintainer clone/worktree if you need local install tooling without breaking portal mode in the linked app.',
  ].join('\n')
);

