import { defaultLocale } from './i18n';

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

/** BCP-47 to Open Graph locale codes (og:locale wants language_TERRITORY). */
export const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  ar: 'ar_AR',
  zh: 'zh_CN',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ja: 'ja_JP',
  ru: 'ru_RU',
  pt: 'pt_BR',
  ko: 'ko_KR',
};
