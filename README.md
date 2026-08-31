# Genesis Mesh - Site

The public site for Genesis Mesh, the treaty layer for machines.

Next.js 14 (App Router), localised into 73 languages with `next-intl`,
statically prerendered, and published with a signed build attestation.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build
npm start
```

The default locale is served unprefixed, so the site answers on `/`, not
`/en`. Every other locale uses its canonical code as a route prefix, such as
`/ar`, `/bn`, `/ps`, and `/zh-Hant`.

## Editing content

All copy lives in `src/messages/<locale>.json`. Components read from it and
contain no prose, so a wording change never means touching markup.
`en.json` is the reference for structure: every other catalogue must have
the same key set and value types, or the build fails before static generation.

Run `npm run check:i18n` for the complete catalogue gate. It checks registry
and file parity, canonical locale metadata, placeholders, protected product
terms and identifiers, SEO keyword separators, Unicode normalization, empty
values, and the project's no-em-dash rule.

## Layout

```
src/
  app/[locale]/     root layout (lang, dir, metadata, JSON-LD) and the page
  app/sitemap.ts    per-locale entries with hreflang alternates
  app/robots.ts
  components/       one component per section
  messages/         one complete catalogue per registered locale
  i18n.ts           locale list, RTL list, request config
  navigation.ts     locale-aware Link and usePathname
  middleware.ts     locale negotiation and routing
  seo.ts            canonical URL helper and Open Graph locale map
scripts/            build signing and verification
```

## Languages

`src/i18n.ts` is the locale registry and single source of truth for the 73
languages. The searchable picker shows endonyms and English names and also
matches locale codes. Simplified and Traditional Chinese are separate entries,
and the existing Brazilian Portuguese route is labelled explicitly.

Arabic, Persian, Hebrew, Pashto, and Urdu render right-to-left. `dir="rtl"`
comes from the locale layout, and the stylesheet uses logical properties plus
`html[dir='rtl']` rules rather than a mirrored sheet.

To add a locale, append its canonical BCP-47 code, endonym, English name, Open
Graph locale, and optional RTL direction to `LOCALES` in `src/i18n.ts`, then
add the matching catalogue. Locale routing, the dropdown, Open Graph metadata,
and the sitemap are derived from that registry. The middleware matcher is
generic and does not need a locale-specific edit.

## Signed builds

The footer claims the site's builds are signed. That claim is generated,
not typed in, so it can only appear when it is true.

`scripts/sign-build.mjs` runs as `prebuild`. It hashes the source tree into
a reproducible digest, signs it with the Network Authority Ed25519 key, and
writes `/.well-known/genesis-mesh/signature.txt` alongside the per-file
manifest the digest covers.

Set the key on the deployment:

```
GENESIS_MESH_SIGNING_KEY   Ed25519 private key - PKCS#8 PEM, base64 PKCS#8
                           DER, or the base64/hex 32-byte seed
```

Without it the build still succeeds, records the artifact as `UNSIGNED`,
and the footer drops the claim rather than asserting something untrue.

The production signing key is dedicated to this site. It is not the protocol
root: a leaked build key can forge site attestations and nothing else.

```
key-id      ac687c764b0c5e4f
public-key  QHCs2Cn9rAEYnAKDon4C0JPgNgDi1dSglie1CzIjwvY=
algorithm   ed25519
```

Anyone can check a deployment:

```bash
npm run verify:build                        # local tree
node scripts/verify-build.mjs https://...   # a live deployment
```

A published attestation carrying any other key id was not produced by this
project's pipeline.

Locally this also recomputes the digest, so a checkout that has drifted
from what was signed is reported as a mismatch.

## Configuration

```
NEXT_PUBLIC_SITE_URL       canonical origin, default https://genesismesh.org
GENESIS_MESH_SIGNING_KEY   see above
```

`vercel.json` carries the response headers: HSTS with preload, nosniff,
`X-Frame-Options: DENY`, `strict-origin-when-cross-origin`, and a
`Permissions-Policy` disabling camera, microphone, geolocation and topics.
