# Genesis Mesh - Site

The public site for Genesis Mesh, the treaty layer for machines.

Next.js 14 (App Router), localised into ten languages with `next-intl`,
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
`/en`. The other nine locales are prefixed: `/ar`, `/zh`, `/es`, `/fr`,
`/de`, `/ja`, `/ru`, `/pt`, `/ko`.

## Editing content

All copy lives in `src/messages/<locale>.json`. Components read from it and
contain no prose, so a wording change never means touching markup.
`en.json` is the reference for structure: every other catalogue must have
the same key set, or the build fails on the missing key.

## Layout

```
src/
  app/[locale]/     root layout (lang, dir, metadata, JSON-LD) and the page
  app/sitemap.ts    per-locale entries with hreflang alternates
  app/robots.ts
  components/       one component per section
  messages/         ten catalogues
  i18n.ts           locale list, RTL list, request config
  navigation.ts     locale-aware Link and usePathname
  middleware.ts     locale negotiation and routing
  seo.ts            canonical URL helper and Open Graph locale map
scripts/            build signing and verification
```

## Languages

English, Arabic, Chinese, Spanish, French, German, Japanese, Russian,
Portuguese, Korean.

Arabic renders right-to-left: `dir="rtl"` comes from the locale layout, and
the stylesheet uses logical properties plus `html[dir='rtl']` rules rather
than a mirrored sheet. Arabic falls back to Noto Sans Arabic, since the
display faces used elsewhere do not cover the range.

To add a locale, add it to `locales` in `src/i18n.ts`, add a catalogue, add
its Open Graph code to `OG_LOCALES` in `src/seo.ts`, and add it to the
middleware matcher. Add it to `rtlLocales` too if it is right-to-left.

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

Anyone can check a deployment:

```bash
npm run verify:build                        # local tree
node scripts/verify-build.mjs https://...   # a live deployment
```

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
