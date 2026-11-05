# Translations

genesismesh.org ships 73 languages plus the Business reader English variant (`src/messages/*.json`). Every locale has
every string; there is no English fallback. `npm run check:i18n` (run before
every build) fails on a missing key, an extra key, a type mismatch or a lost
ICU placeholder.

## 2026-10-04 update

New and changed strings (hero "Try it" block, nav links, the operator path in
the closing section, the reproduce-in-browser line, the live-data fallback, the
builders path, RFC statuses and the generated version/test sentence) were
machine-translated into all 72 non-English locales, keeping each locale's
existing terminology. Commands, package names, URLs and product names stay in
English everywhere.

Review is welcome for every locale and most useful for the lower-resource ones:
am, as, ha, km, lo, my, or, ps, si, so, uz, zu.

To correct a translation, edit the locale file and run `npm run check:i18n`.

## Business reader

Choose **Business reader / Plain English** beside English in the language menu,
or open `/en-x-business` directly. This is an English reading variant, not a
new spoken language. The BCP-47 private-use code works with Intl date formatting.
It uses the same page components and live data, with a complete, independently
written catalogue. The supplier scenario is illustrative, not a customer claim.

Keep the distinction between recorded tests, live status and external adoption.
Revocation takes effect in the receiving system after it checks and applies the
update. Preserve placeholders, technical identifiers and linked evidence when
updating the copy. Validate with `npm run check:i18n`, `npm run typecheck`,
`npm run build`, and `npm run check:i18n:site` against a running site.
