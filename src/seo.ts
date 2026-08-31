import { LOCALES, defaultLocale } from './i18n';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://genesismesh.org'
).replace(/\/$/, '');

/**
 * Canonical URL for a locale. `localePrefix: 'as-needed'` means the default
 * locale is served unprefixed at the root, so it must not get a `/en` canonical.
 */
export function localeUrl(locale: string, path = ''): string {
  const suffix = path.replace(/^\//, '');
  if (locale === defaultLocale) {
    return suffix ? `${SITE_URL}/${suffix}` : `${SITE_URL}/`;
  }
  return suffix ? `${SITE_URL}/${locale}/${suffix}` : `${SITE_URL}/${locale}`;
}

/** BCP-47 to Open Graph locale codes, derived from the locale registry. */
export const OG_LOCALES: Record<string, string> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l.og])
);
