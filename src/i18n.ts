import { getRequestConfig } from 'next-intl/server';

/**
 * Single source of truth for every locale the site ships.
 *
 * `name` is the endonym shown in the picker, `english` backs the picker's
 * search box so people can find a language by either spelling, and `og` is the
 * Open Graph language_TERRITORY form.
 *
 * To add a locale: append an entry here, add `src/messages/<code>.json`, and
 * add the code to the middleware matcher. Nothing else needs touching.
 */
export type LocaleMeta = {
  code: string;
  name: string;
  english: string;
  og: string;
  dir?: 'rtl';
};

export const LOCALES: LocaleMeta[] = [
  { code: 'en', name: 'English', english: 'English', og: 'en_US' },
  { code: 'ar', name: 'العربية', english: 'Arabic', og: 'ar_AR', dir: 'rtl' },
  { code: 'de', name: 'Deutsch', english: 'German', og: 'de_DE' },
  { code: 'el', name: 'Ελληνικά', english: 'Greek', og: 'el_GR' },
  { code: 'es', name: 'Español', english: 'Spanish', og: 'es_ES' },
  { code: 'fa', name: 'فارسی', english: 'Persian', og: 'fa_IR', dir: 'rtl' },
  { code: 'fr', name: 'Français', english: 'French', og: 'fr_FR' },
  { code: 'he', name: 'עברית', english: 'Hebrew', og: 'he_IL', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', og: 'hi_IN' },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', og: 'id_ID' },
  { code: 'it', name: 'Italiano', english: 'Italian', og: 'it_IT' },
  { code: 'ja', name: '日本語', english: 'Japanese', og: 'ja_JP' },
  { code: 'ko', name: '한국어', english: 'Korean', og: 'ko_KR' },
  { code: 'nl', name: 'Nederlands', english: 'Dutch', og: 'nl_NL' },
  { code: 'pl', name: 'Polski', english: 'Polish', og: 'pl_PL' },
  { code: 'pt', name: 'Português', english: 'Portuguese', og: 'pt_BR' },
  { code: 'ru', name: 'Русский', english: 'Russian', og: 'ru_RU' },
  { code: 'sv', name: 'Svenska', english: 'Swedish', og: 'sv_SE' },
  { code: 'th', name: 'ไทย', english: 'Thai', og: 'th_TH' },
  { code: 'tr', name: 'Türkçe', english: 'Turkish', og: 'tr_TR' },
  { code: 'uk', name: 'Українська', english: 'Ukrainian', og: 'uk_UA' },
  { code: 'ur', name: 'اردو', english: 'Urdu', og: 'ur_PK', dir: 'rtl' },
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', og: 'vi_VN' },
  { code: 'zh', name: '中文', english: 'Chinese', og: 'zh_CN' },
];

export const locales = LOCALES.map((l) => l.code);
export const defaultLocale = 'en';
export const rtlLocales = LOCALES.filter((l) => l.dir === 'rtl').map((l) => l.code);

export type Locale = string;

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as string) ? (requested as string) : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
