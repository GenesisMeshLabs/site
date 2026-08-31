#!/usr/bin/env node
/**
 * Verify a published build attestation. Anyone can run this - that is what
 * makes the footer claim checkable rather than decorative.
 *
 *   node scripts/verify-build.mjs                      # local tree
 *   node scripts/verify-build.mjs https://example.org  # a live deployment
 *
 * Locally this checks two things: that the signature is authentic, and that the
 * signed digest still matches the source tree on disk. Against a deployment it
 * can only check the first, since the served site is compiled output.
 */
import { verify as edVerify, createPublicKey } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDigest } from './lib/digest.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PATH = '/.well-known/genesis-mesh/signature.txt';

const target = process.argv[2];

const raw = target
  ? await fetch(new URL(PATH, target)).then((r) => {
      if (!r.ok) throw new Error(`${r.status} fetching ${PATH}`);
      return r.text();
    })
  : readFileSync(join(ROOT, 'public', '.well-known', 'genesis-mesh', 'signature.txt'), 'utf8');

const field = (name) => raw.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (field('status') !== 'SIGNED') {
  fail(`UNSIGNED build: ${field('reason') || 'no signature present'}`);
}

const digest = field('source-digest')?.replace(/^sha256:/, '');
const signature = field('signature');
const publicKeyRaw = field('public-key');

if (!digest || !signature || !publicKeyRaw) {
  fail('Malformed attestation: missing digest, signature, or public key');
}

// Rebuild the SPKI wrapper around the raw 32-byte Ed25519 public key.
const spki = Buffer.concat([
  Buffer.from('302a300506032b6570032100', 'hex'),
  Buffer.from(publicKeyRaw, 'base64'),
]);
const publicKey = createPublicKey({ key: spki, format: 'der', type: 'spki' });

if (!edVerify(null, Buffer.from(digest, 'hex'), publicKey, Buffer.from(signature, 'base64'))) {
  fail(`SIGNATURE INVALID for digest sha256:${digest}`);
}

console.log('Signature valid.');
console.log('  key-id:       ', field('key-id'));
console.log('  source-digest: sha256:' + digest);
console.log('  built-at:     ', field('built-at'));

if (!target) {
  const actual = buildDigest(ROOT).digest;
  if (actual !== digest) {
    fail(
      `\nDIGEST MISMATCH - the source tree has changed since it was signed.\n` +
        `  signed: sha256:${digest}\n  actual: sha256:${actual}\n` +
        `  Re-run: npm run sign:build`
    );
  }
  console.log('  tree:          matches the signed digest');
}
