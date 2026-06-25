import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contextPath = path.join(root, 'docs', 'PROJECT_CONTEXT.json');
const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));

const errors = [];

function readRelative(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function existsRelative(file) {
  return fs.existsSync(path.join(root, file));
}

function requireFile(file) {
  if (!existsRelative(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }
  return readRelative(file);
}

function requireIncludes(file, terms) {
  const content = requireFile(file);
  for (const term of terms) {
    if (!content.includes(term)) {
      errors.push(`${file} must include "${term}"`);
    }
  }
}

function scanFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const relative = path.join(dir, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      out.push(...scanFiles(relative, predicate));
    } else if (predicate(relative)) {
      out.push(relative);
    }
  }
  return out;
}

for (const file of context.canonicalDocs) {
  requireFile(file);
}

for (const file of context.requiredAgentDocs) {
  requireIncludes(file, ['docs/GOVERNANCE.md', 'docs/PROJECT_CONTEXT.json', 'Firestore']);
}

for (const file of ['docs/GOVERNANCE.md', ...context.requiredAgentDocs]) {
  requireIncludes(file, context.operationalRules.requiredDocTerms);
}

if (!existsRelative(context.operationalRules.featureMemoDirectory)) {
  errors.push(`Missing memo directory: ${context.operationalRules.featureMemoDirectory}`);
}

const stackTerms = Object.values(context.stack);
for (const file of ['README.md', 'docs/ARCHITECTURE.md', 'docs/instructions/INDEX.md']) {
  requireIncludes(file, stackTerms.filter(Boolean));
}

for (const envName of context.environmentVariables) {
  requireIncludes('.env.example', [envName]);
  requireIncludes('docs/SETUP.md', [envName]);
}

const packageJson = JSON.parse(readRelative('package.json'));
for (const dependency of ['next', 'typescript', 'tailwindcss', 'firebase-admin']) {
  if (!packageJson.dependencies?.[dependency] && !packageJson.devDependencies?.[dependency]) {
    errors.push(`package.json must declare ${dependency}`);
  }
}

const docsToScan = [
  'README.md',
  'CLAUDE.md',
  'GEMINI.md',
  'INSTRUCTIONS.md',
  '.github/copilot-instructions.md',
  '.cursor/rules/main.mdc',
  ...scanFiles('docs', (file) => file.endsWith('.md')),
];

const allowedDeprecatedFiles = new Set([
  'docs/PROJECT_CONTEXT.json',
  'docs/GOVERNANCE.md',
  'docs/decisions/0001-firestore-as-current-data-store.md',
]);

for (const file of docsToScan) {
  if (allowedDeprecatedFiles.has(file)) continue;
  const content = requireFile(file);
  for (const claim of context.deprecatedClaims) {
    if (content.includes(claim)) {
      errors.push(`${file} contains deprecated claim "${claim}"`);
    }
  }
}

if (errors.length > 0) {
  console.error('Documentation consistency check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Documentation consistency check passed.');
