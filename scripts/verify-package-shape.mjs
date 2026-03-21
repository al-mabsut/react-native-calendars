import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function must(cond, msg) {
  if (!cond) {
    console.error(`[verify-package-shape] FAIL: ${msg}`);
    process.exit(1);
  }
}

const pkgPath = path.join(repoRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

must(pkg.main === 'lib/index.js', `package.json main must be lib/index.js (got ${pkg.main})`);
must(pkg.types === 'lib/index.d.ts', `package.json types must be lib/index.d.ts (got ${pkg.types})`);
must(pkg['react-native'] === 'src/index.ts', `package.json react-native must be src/index.ts (got ${pkg['react-native']})`);
must(!('prepare' in pkg.scripts), 'package.json must not define a prepare script');
must(pkg.peerDependencies?.react, 'package.json must declare peerDependencies.react');
must(pkg.peerDependencies?.['react-native'], 'package.json must declare peerDependencies.react-native');

const forbidden = ['createRequire', '__dirname + ', 'process.cwd()'];
const mainJs = fs.readFileSync(path.join(repoRoot, 'lib/index.js'), 'utf8');
for (const p of forbidden) {
  must(!mainJs.includes(p), `lib/index.js must not contain fragile pattern: ${p}`);
}

let tgz;
try {
  tgz = execFileSync('npm', ['pack', '--pack-destination', repoRoot, '--silent'], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  })
    .trim()
    .split('\n')
    .filter(Boolean)
    .pop();
} catch (e) {
  console.error('[verify-package-shape] npm pack failed', e?.message || e);
  process.exit(1);
}

must(tgz && tgz.endsWith('.tgz'), `could not determine .tgz name from npm pack output: ${JSON.stringify(tgz)}`);

const tgzPath = path.join(repoRoot, tgz);
const listing = execFileSync('tar', ['-tzf', tgzPath], {encoding: 'utf8'});
const lines = listing.split('\n').filter(Boolean);

function hasEntry(suffix) {
  return lines.some((l) => l === `package/${suffix}` || l.endsWith(`/${suffix}`));
}

const required = [
  'package.json',
  'src/index.ts',
  'lib/index.js',
  'lib/index.d.ts',
  'scripts/portal-clean.mjs',
  'src/calendar-list/index.tsx'
];

for (const rel of required) {
  must(hasEntry(rel), `packed tarball missing: ${rel}`);
}

must(
  !lines.some((l) => l.includes('package/node_modules/')),
  'packed tarball must not contain node_modules/'
);

const forbiddenPackPrefixes = ['package/.agents/', 'package/.cursor/'];
for (const prefix of forbiddenPackPrefixes) {
  must(
    !lines.some((l) => l.startsWith(prefix)),
    `packed tarball must not contain repo-local metadata: ${prefix}`
  );
}

fs.unlinkSync(tgzPath);
console.log('[verify-package-shape] OK — npm pack contains required entries and metadata checks passed.');
