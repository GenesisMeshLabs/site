import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/u, '');
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, 'src', 'i18n.ts'), 'utf8');
const locales = [
  ...registry.matchAll(
    /\{\s*code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*english:\s*'([^']+)',\s*og:\s*'([^']+)'(?:,\s*dir:\s*'([^']+)')?\s*\}/g
  ),
].map((match) => ({ code: match[1], dir: match[5] === 'rtl' ? 'rtl' : 'ltr' }));
const defaultLocale = 'en';
const productionOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://genesismesh.org').replace(
  /\/$/u,
  ''
);
const failures = [];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

function routeFor(code) {
  return code === defaultLocale ? '/' : `/${code}`;
}

function productionUrlFor(code) {
  return code === defaultLocale ? `${productionOrigin}/` : `${productionOrigin}/${code}`;
}

async function checkLocale({ code, dir }) {
  const route = routeFor(code);
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const messages = JSON.parse(
    fs.readFileSync(path.join(root, 'src', 'messages', `${code}.json`), 'utf8')
  );

  if (response.status !== 200) failures.push(`${code}: page returned ${response.status}`);
  if (!html.includes(`<html lang="${code}" dir="${dir}">`)) {
    failures.push(`${code}: incorrect html lang or dir`);
  }
  if (!html.includes(`<title>${escapeHtml(messages.seo.title)}</title>`)) {
    failures.push(`${code}: localized title is missing`);
  }
  if (!html.includes(`href="/${code}/manifest.webmanifest"`)) {
    failures.push(`${code}: localized manifest link is missing`);
  }
  if (!html.includes('authority@genesismesh.org')) {
    failures.push(`${code}: authority contact is missing`);
  }
  if (response.headers.has('link')) {
    failures.push(`${code}: duplicate middleware Link header is still present`);
  }

  const manifestResponse = await fetch(`${baseUrl}/${code}/manifest.webmanifest`);
  if (manifestResponse.status !== 200) {
    failures.push(`${code}: manifest returned ${manifestResponse.status}`);
    return;
  }
  if (!manifestResponse.headers.get('content-type')?.includes('application/manifest+json')) {
    failures.push(`${code}: manifest has the wrong content type`);
  }
  const manifest = await manifestResponse.json();
  if (manifest.lang !== code || manifest.dir !== dir) {
    failures.push(`${code}: manifest has incorrect language metadata`);
  }
  if (manifest.description !== messages.seo.description) {
    failures.push(`${code}: manifest description is not localized`);
  }
  if (manifest.start_url !== route) {
    failures.push(`${code}: manifest start_url is ${manifest.start_url}, expected ${route}`);
  }
}

for (let index = 0; index < locales.length; index += 8) {
  await Promise.all(locales.slice(index, index + 8).map(checkLocale));
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
if (sitemapResponse.status !== 200) failures.push(`sitemap returned ${sitemapResponse.status}`);
const urlCount = (sitemap.match(/<url>/g) || []).length;
const alternateCount = (sitemap.match(/<xhtml:link\s/g) || []).length;
if (urlCount !== locales.length) {
  failures.push(`sitemap has ${urlCount} URLs, expected ${locales.length}`);
}
const expectedAlternates = locales.length * (locales.length + 1);
if (alternateCount !== expectedAlternates) {
  failures.push(`sitemap has ${alternateCount} alternates, expected ${expectedAlternates}`);
}
for (const { code } of locales) {
  if (!sitemap.includes(`<loc>${productionUrlFor(code)}</loc>`)) {
    failures.push(`${code}: sitemap URL is missing`);
  }
  if (!sitemap.includes(`hreflang="${code}"`)) {
    failures.push(`${code}: sitemap hreflang is missing`);
  }
}
if (!sitemap.includes('hreflang="x-default"')) {
  failures.push('sitemap x-default is missing');
}

const securityResponse = await fetch(`${baseUrl}/.well-known/security.txt`);
const securityText = await securityResponse.text();
if (securityResponse.status !== 200) {
  failures.push(`security.txt returned ${securityResponse.status}`);
}
if (!securityResponse.headers.get('content-type')?.includes('text/plain')) {
  failures.push('security.txt has the wrong content type');
}
for (const requiredLine of [
  'Contact: mailto:authority@genesismesh.org',
  'Expires: 2027-09-01T00:00:00.000Z',
  'Canonical: https://genesismesh.org/.well-known/security.txt',
  'Policy: https://github.com/GenesisMeshLabs/genesismesh/security/policy',
  'Preferred-Languages: en',
]) {
  if (!securityText.includes(requiredLine)) failures.push(`security.txt is missing ${requiredLine}`);
}
const liveProofResponse = await fetch(`${baseUrl}/api/live-proof`);
const liveProof = await liveProofResponse.json();
const liveKeys = Object.keys(liveProof).sort();
const availableKeys = [
  'activeTreaties',
  'available',
  'checkedAt',
  'health',
  'lastUpdatedAt',
  'recognitionEdges',
  'revocationFeed',
  'revocations',
  'sovereignDomains',
  'trustCycle',
].sort();
const unavailableKeys = ['available', 'checkedAt'].sort();
const expectedLiveKeys = liveProof.available ? availableKeys : unavailableKeys;
if (JSON.stringify(liveKeys) !== JSON.stringify(expectedLiveKeys)) {
  failures.push(`live proof exposes unexpected fields: ${liveKeys.join(', ')}`);
}
if (liveProof.available) {
  if (Object.hasOwn(liveProof, 'freshness')) {
    failures.push('live proof exposes an ambiguous top-level freshness field');
  }
  const revocationFeedKeys = Object.keys(liveProof.revocationFeed || {}).sort();
  const expectedRevocationFeedKeys = ['freshness'];
  if (JSON.stringify(revocationFeedKeys) !== JSON.stringify(expectedRevocationFeedKeys)) {
    failures.push(`live proof revocation feed exposes unexpected fields: ${revocationFeedKeys.join(', ')}`);
  }
  const trustCycleKeys = Object.keys(liveProof.trustCycle || {}).sort();
  const expectedTrustCycleKeys = ['completedAt', 'freshness', 'status'].sort();
  if (JSON.stringify(trustCycleKeys) !== JSON.stringify(expectedTrustCycleKeys)) {
    failures.push(`live proof trust cycle exposes unexpected fields: ${trustCycleKeys.join(', ')}`);
  }
}
if (liveProof.available && liveProofResponse.status !== 200) {
  failures.push(`available live proof returned ${liveProofResponse.status}`);
}
if (!liveProof.available && liveProofResponse.status !== 503) {
  failures.push(`unavailable live proof returned ${liveProofResponse.status}`);
}

const unknownResponse = await fetch(`${baseUrl}/xx-unsupported`, { redirect: 'manual' });
if (unknownResponse.status !== 404) {
  failures.push(`unknown locale returned ${unknownResponse.status}, expected 404`);
}

const prefixedDefault = await fetch(`${baseUrl}/en`, { redirect: 'manual' });
if (prefixedDefault.status !== 308 || prefixedDefault.headers.get('location') !== '/') {
  failures.push(
    `default locale prefix returned ${prefixedDefault.status}, expected a permanent redirect to /`
  );
}

// No redirect by browser language or an earlier choice: `/` is English for everyone.
const foreignVisitor = await fetch(`${baseUrl}/`, {
  redirect: 'manual',
  headers: { 'Accept-Language': 'fr-FR,fr;q=0.9', Cookie: 'NEXT_LOCALE=de' },
});
if (foreignVisitor.status !== 200) {
  failures.push(`/ answered a French browser with ${foreignVisitor.status}, expected 200`);
}
if ((foreignVisitor.headers.get('set-cookie') || '').includes('NEXT_LOCALE')) {
  failures.push('/ set a locale cookie');
}

// No open redirect. next-intl 3 sent `/en/%09/example%2Ecom` to
// https://example.com/: the tab is dropped and `//example.com` names a host.
const origin = new URL(baseUrl).origin;
for (const probe of [
  '/en/%09/example%2Ecom',
  '/en/%09/2130706433',
  '/en//example.com',
  '/en/%2F%2Fexample.com',
  '/en/%5C%5Cexample.com',
  '/en/%0D%0A/example.com',
  '/fr/%09/example%2Ecom',
]) {
  const response = await fetch(`${baseUrl}${probe}`, { redirect: 'manual' });
  const location = response.headers.get('location');
  if (location && new URL(location, baseUrl).origin !== origin) {
    failures.push(`${probe} redirects off the site, to ${location}`);
  }
}

if (failures.length > 0) {
  console.error(`Localized site check failed with ${failures.length} error(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Localized site check passed: ${locales.length} pages, ${locales.length} manifests, ` +
    `${urlCount} sitemap URLs, ${alternateCount} hreflang alternates, security.txt, and safe live proof.`
);
