#!/usr/bin/env node
/**
 * Refresh src/generated/release.json from the facts the core docs build
 * publishes on every main push (version and collected test count), so the
 * Protocol section never shows stale numbers again.
 *
 * If the docs site cannot be reached, the committed file is kept and the build
 * warns loudly instead of failing an unrelated deploy.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const TARGET = join(ROOT, 'src', 'generated', 'release.json');
const SOURCE = 'https://docs.genesismesh.org/release-facts.json';

function valid(facts) {
  return (
    facts &&
    typeof facts.version === 'string' &&
    /^\d+\.\d+\.\d+$/.test(facts.version) &&
    Number.isInteger(facts.tests) &&
    facts.tests > 0
  );
}

const current = JSON.parse(readFileSync(TARGET, 'utf8'));
if (!valid(current)) {
  console.error(`release-facts: ${TARGET} is invalid`);
  process.exit(1);
}

try {
  const response = await fetch(SOURCE, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const facts = await response.json();
  if (!valid(facts)) throw new Error('unexpected content');
  const next = { version: facts.version, tests: facts.tests, source: SOURCE };
  writeFileSync(TARGET, JSON.stringify(next, null, 2) + '\n');
  console.log(`release-facts: v${next.version}, ${next.tests} tests`);
} catch (error) {
  console.warn(
    `release-facts: WARNING could not read ${SOURCE} (${error.message}); ` +
      `keeping v${current.version}, ${current.tests} tests from the committed file`
  );
}
