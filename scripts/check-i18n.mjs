import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const messagesDir = path.join(root, 'src', 'messages');
const registryPath = path.join(root, 'src', 'i18n.ts');
const referenceLocale = 'en';

const registrySource = fs.readFileSync(registryPath, 'utf8');
const registryEntries = [
  ...registrySource.matchAll(
    /\{\s*code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*english:\s*'([^']+)',\s*og:\s*'([^']+)'(?:,\s*dir:\s*'([^']+)')?\s*\}/g
  ),
].map((match) => ({
  code: match[1],
  name: match[2],
  english: match[3],
  og: match[4],
  dir: match[5],
}));
const registryCodes = registryEntries.map((entry) => entry.code);

const messageFiles = fs
  .readdirSync(messagesDir)
  .filter((file) => file.endsWith('.json'))
  .sort();
const fileCodes = messageFiles.map((file) => path.basename(file, '.json'));

const errors = [];

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function describe(value, keyPath = '', result = new Map()) {
  const kind = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  result.set(keyPath || '<root>', kind);

  if (Array.isArray(value)) {
    value.forEach((item, index) => describe(item, `${keyPath}[${index}]`, result));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      describe(item, keyPath ? `${keyPath}.${key}` : key, result);
    }
  }

  return result;
}

function flattenStrings(value, keyPath = '', result = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStrings(item, `${keyPath}[${index}]`, result));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      flattenStrings(item, keyPath ? `${keyPath}.${key}` : key, result);
    }
  } else if (typeof value === 'string') {
    result.set(keyPath, value);
  }

  return result;
}

function placeholders(value) {
  return [...value.matchAll(/\{[^{}]+\}/g)].map((match) => match[0]).sort();
}

function parseCatalogue(file) {
  const fullPath = path.join(messagesDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');

  if (source.includes('\uFFFD')) {
    errors.push(`${file}: contains the Unicode replacement character`);
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    return null;
  }
}

if (registryCodes.length === 0) {
  errors.push('src/i18n.ts: no locale registry entries found');
}

const duplicateCodes = registryCodes.filter(
  (code, index) => registryCodes.indexOf(code) !== index
);
if (duplicateCodes.length > 0) {
  errors.push(`src/i18n.ts: duplicate locale codes: ${[...new Set(duplicateCodes)].join(', ')}`);
}

const rtlLanguages = new Set(['ar', 'fa', 'he', 'ps', 'ur']);
for (const entry of registryEntries) {
  let canonicalCode;
  try {
    canonicalCode = Intl.getCanonicalLocales(entry.code)[0];
  } catch {
    errors.push(`src/i18n.ts: ${entry.code} is not a valid BCP-47 locale`);
    continue;
  }

  if (canonicalCode !== entry.code) {
    errors.push(`src/i18n.ts: ${entry.code} should use canonical spelling ${canonicalCode}`);
  }
  if (!/^[a-z]{2,3}_[A-Z]{2}$/u.test(entry.og)) {
    errors.push(`src/i18n.ts: ${entry.code} has invalid Open Graph locale ${entry.og}`);
  }
  if (entry.dir && entry.dir !== 'rtl') {
    errors.push(`src/i18n.ts: ${entry.code} has unsupported direction ${entry.dir}`);
  }
  if (rtlLanguages.has(entry.code) !== (entry.dir === 'rtl')) {
    errors.push(`src/i18n.ts: ${entry.code} has an incorrect text direction`);
  }
  if (entry.name !== entry.name.normalize('NFC')) {
    errors.push(`src/i18n.ts: ${entry.code} endonym is not NFC-normalized`);
  }
  if (entry.name.includes('\u2014')) {
    errors.push(`src/i18n.ts: ${entry.code} endonym contains a forbidden U+2014 em dash`);
  }
}

const missingFiles = difference(registryCodes, fileCodes);
const unregisteredFiles = difference(fileCodes, registryCodes);
if (missingFiles.length > 0) {
  errors.push(`Missing message files: ${missingFiles.join(', ')}`);
}
if (unregisteredFiles.length > 0) {
  errors.push(`Unregistered message files: ${unregisteredFiles.join(', ')}`);
}

const reference = parseCatalogue(`${referenceLocale}.json`);
const referenceShape = reference ? describe(reference) : new Map();
const referenceStrings = reference ? flattenStrings(reference) : new Map();

const protectedTerms = [
  'Genesis Mesh',
  'GENESIS■MESH',
  'Ed25519',
  'TSWI',
  'TypeScript',
  'Go',
  '.NET',
  'Tamarin',
  'Azure',
  'DigitalOcean',
  'Cloudflare',
  'Akamai/Linode',
  'Elections 2026',
  'authority@genesismesh.org',
];

const fixedValuePaths = new Set([
  'nav.brand',
  'stakes.stats.one',
  'stakes.stats.two',
  'stakes.stats.three',
  'mechanics.ops[0].num',
  'mechanics.ops[1].num',
  'mechanics.ops[2].num',
  'mechanics.ops[3].num',
  'protocol.rfcs[0].id',
  'protocol.rfcs[1].id',
  'protocol.rfcs[2].id',
  'protocol.rfcs[3].id',
  'protocol.rfcs[4].id',
  'protocol.rfcs[5].id',
  'protocol.rfcs[6].id',
  'protocol.rfcs[7].id',
]);

for (const file of messageFiles) {
  const catalogue = file === `${referenceLocale}.json` ? reference : parseCatalogue(file);
  if (!catalogue || !reference) continue;

  const shape = describe(catalogue);
  const strings = flattenStrings(catalogue);
  const missingPaths = difference([...referenceShape.keys()], [...shape.keys()]);
  const extraPaths = difference([...shape.keys()], [...referenceShape.keys()]);

  if (missingPaths.length > 0) {
    errors.push(`${file}: missing paths: ${missingPaths.join(', ')}`);
  }
  if (extraPaths.length > 0) {
    errors.push(`${file}: extra paths: ${extraPaths.join(', ')}`);
  }

  for (const [keyPath, expectedKind] of referenceShape) {
    const actualKind = shape.get(keyPath);
    if (actualKind && actualKind !== expectedKind) {
      errors.push(`${file}: ${keyPath} is ${actualKind}, expected ${expectedKind}`);
    }
  }

  for (const [keyPath, value] of strings) {
    if (!value.trim()) {
      errors.push(`${file}: ${keyPath} is empty`);
    }
    if (/\u2014/u.test(value)) {
      errors.push(`${file}: ${keyPath} contains a forbidden U+2014 em dash`);
    }
    if (value !== value.normalize('NFC')) {
      errors.push(`${file}: ${keyPath} is not NFC-normalized`);
    }

    const expected = referenceStrings.get(keyPath);
    if (expected && placeholders(value).join('|') !== placeholders(expected).join('|')) {
      errors.push(`${file}: ${keyPath} does not preserve ICU placeholders`);
    }

    if (expected) {
      if (fixedValuePaths.has(keyPath) && value !== expected) {
        errors.push(`${file}: ${keyPath} must remain exactly ${expected}`);
      }
      for (const term of protectedTerms) {
        if (expected.includes(term) && !value.includes(term)) {
          errors.push(`${file}: ${keyPath} does not preserve ${term}`);
        }
      }
    }
  }

  for (const tier of ['l1', 'l2', 'l3']) {
    const expectedCode = tier.toUpperCase();
    const value = strings.get(`protocol.stack.${tier}.code`);
    if (value !== expectedCode) {
      errors.push(`${file}: protocol.stack.${tier}.code must remain ${expectedCode}`);
    }
  }

  const keywordCount = (strings.get('seo.keywords') ?? '').split('|').length;
  const keywordEntries = (strings.get('seo.keywords') ?? '').split('|');
  const referenceKeywordCount = (referenceStrings.get('seo.keywords') ?? '').split('|').length;
  if (keywordCount !== referenceKeywordCount) {
    errors.push(
      `${file}: seo.keywords has ${keywordCount} entries, expected ${referenceKeywordCount}`
    );
  }
  if (keywordEntries.some((entry) => !entry.trim())) {
    errors.push(`${file}: seo.keywords contains an empty entry`);
  }
}

if (errors.length > 0) {
  console.error(`i18n validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `i18n validation passed: ${registryCodes.length} locales, ${referenceStrings.size} strings each.`
);
