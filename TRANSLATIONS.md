# Translations

genesismesh.org ships 73 locales (`src/messages/*.json`). Every locale has
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
