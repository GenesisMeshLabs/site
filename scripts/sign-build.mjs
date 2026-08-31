#!/usr/bin/env node
/**
 * Sign the deployable source tree with the Network Authority Ed25519 key and
 * publish the result at /.well-known/genesis-mesh/signature.txt.
 *
 * Runs as `prebuild`, so the signature is emitted into public/ before Next.js
 * copies it into the deployment.
 *
 * Key material comes from GENESIS_MESH_SIGNING_KEY, accepted as either:
 *   - a PKCS#8 PEM private key (newlines may be escaped as \n), or
 *   - base64 of a PKCS#8 DER key, or
 *   - base64/hex of the raw 32-byte Ed25519 seed.
 *
 * With no key configured the build still succeeds, but it records the build as
 * UNSIGNED and the site drops the "signed under Genesis Mesh authority" claim
 * rather than asserting something untrue.
 */
import { createHash, createPrivateKey, createPublicKey, sign as edSign } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDigest } from './lib/digest.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const WELL_KNOWN = join(ROOT, 'public', '.well-known', 'genesis-mesh');
const STATUS_FILE = join(ROOT, 'src', 'build-signature.json');

function loadKey(raw) {
  const material = raw.trim();

  if (material.includes('BEGIN')) {
    return createPrivateKey(material.replace(/\\n/g, '\n'));
  }

  const isHex = /^[0-9a-fA-F]{64}$/.test(material);
  const bytes = isHex ? Buffer.from(material, 'hex') : Buffer.from(material, 'base64');

  // A bare 32-byte seed needs the PKCS#8 wrapper Node expects.
  if (bytes.length === 32) {
    const der = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), bytes]);
    return createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
  }

  return createPrivateKey({ key: bytes, format: 'der', type: 'pkcs8' });
}

const { manifest, digest } = buildDigest(ROOT);
const builtAt = new Date().toISOString();
const rawKey = process.env.GENESIS_MESH_SIGNING_KEY;

mkdirSync(WELL_KNOWN, { recursive: true });

let status;
let body;

if (!rawKey) {
  status = { signed: false, digest, builtAt, algorithm: 'ed25519' };
  body = [
    '# Genesis Mesh build attestation',
    'status: UNSIGNED',
    'reason: GENESIS_MESH_SIGNING_KEY is not configured for this build',
    'algorithm: ed25519',
    `source-digest: sha256:${digest}`,
    `built-at: ${builtAt}`,
    '',
  ].join('\n');
  console.warn('[sign-build] GENESIS_MESH_SIGNING_KEY not set - build recorded as UNSIGNED');
} else {
  const privateKey = loadKey(rawKey);
  const signature = edSign(null, Buffer.from(digest, 'hex'), privateKey).toString('base64');
  const publicKey = createPublicKey(privateKey)
    .export({ format: 'der', type: 'spki' })
    .subarray(-32)
    .toString('base64');
  const keyId = createHash('sha256').update(publicKey).digest('hex').slice(0, 16);

  status = { signed: true, digest, builtAt, algorithm: 'ed25519', keyId, publicKey };
  body = [
    '# Genesis Mesh build attestation',
    'status: SIGNED',
    'algorithm: ed25519',
    `key-id: ${keyId}`,
    `public-key: ${publicKey}`,
    `source-digest: sha256:${digest}`,
    `signature: ${signature}`,
    `built-at: ${builtAt}`,
    '',
    '# The signature covers the raw bytes of source-digest, which is the sha256',
    '# of the sorted per-file hash manifest published alongside this file.',
    '# Verify with: npm run verify:build',
    '',
  ].join('\n');
  console.log(`[sign-build] signed sha256:${digest.slice(0, 16)}... with key ${keyId}`);
}

writeFileSync(join(WELL_KNOWN, 'signature.txt'), body, 'utf8');
writeFileSync(join(WELL_KNOWN, 'manifest.txt'), manifest.join('\n') + '\n', 'utf8');
writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2) + '\n', 'utf8');
