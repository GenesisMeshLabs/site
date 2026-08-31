import { getRequestConfig } from 'next-intl/server';

/**
 * Single source of truth for every locale the site ships.
 *
 * `name` is the endonym shown in the picker, `english` backs the picker's
 * search box so people can find a language by either spelling, and `og` is the
 * Open Graph language_TERRITORY form.
 *
 * To add a locale: append an entry here and add `src/messages/<code>.json`.
 * Routing, the picker, metadata, and the sitemap derive from this registry.
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
  { code: 'af', name: 'Afrikaans', english: 'Afrikaans', og: 'af_ZA' },
  { code: 'am', name: 'አማርኛ', english: 'Amharic', og: 'am_ET' },
  { code: 'ar', name: 'العربية', english: 'Arabic', og: 'ar_SA', dir: 'rtl' },
  { code: 'as', name: 'অসমীয়া', english: 'Assamese', og: 'as_IN' },
  { code: 'az', name: 'Azərbaycanca', english: 'Azerbaijani', og: 'az_AZ' },
  { code: 'bg', name: 'Български', english: 'Bulgarian', og: 'bg_BG' },
  { code: 'bn', name: 'বাংলা', english: 'Bangla', og: 'bn_BD' },
  { code: 'bs', name: 'Bosanski', english: 'Bosnian', og: 'bs_BA' },
  { code: 'ca', name: 'Català', english: 'Catalan', og: 'ca_ES' },
  { code: 'cs', name: 'Čeština', english: 'Czech', og: 'cs_CZ' },
  { code: 'da', name: 'Dansk', english: 'Danish', og: 'da_DK' },
  { code: 'de', name: 'Deutsch', english: 'German', og: 'de_DE' },
  { code: 'el', name: 'Ελληνικά', english: 'Greek', og: 'el_GR' },
  { code: 'es', name: 'Español', english: 'Spanish', og: 'es_ES' },
  { code: 'et', name: 'Eesti', english: 'Estonian', og: 'et_EE' },
  { code: 'fa', name: 'فارسی', english: 'Persian', og: 'fa_IR', dir: 'rtl' },
  { code: 'fi', name: 'Suomi', english: 'Finnish', og: 'fi_FI' },
  { code: 'fil', name: 'Filipino', english: 'Filipino', og: 'fil_PH' },
  { code: 'fr', name: 'Français', english: 'French', og: 'fr_FR' },
  { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati', og: 'gu_IN' },
  { code: 'ha', name: 'Hausa', english: 'Hausa', og: 'ha_NG' },
  { code: 'he', name: 'עברית', english: 'Hebrew', og: 'he_IL', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', og: 'hi_IN' },
  { code: 'hr', name: 'Hrvatski', english: 'Croatian', og: 'hr_HR' },
  { code: 'hu', name: 'Magyar', english: 'Hungarian', og: 'hu_HU' },
  { code: 'hy', name: 'Հայերեն', english: 'Armenian', og: 'hy_AM' },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', og: 'id_ID' },
  { code: 'it', name: 'Italiano', english: 'Italian', og: 'it_IT' },
  { code: 'ja', name: '日本語', english: 'Japanese', og: 'ja_JP' },
  { code: 'ka', name: 'ქართული', english: 'Georgian', og: 'ka_GE' },
  { code: 'kk', name: 'Қазақша', english: 'Kazakh', og: 'kk_KZ' },
  { code: 'km', name: 'ខ្មែរ', english: 'Khmer', og: 'km_KH' },
  { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada', og: 'kn_IN' },
  { code: 'ko', name: '한국어', english: 'Korean', og: 'ko_KR' },
  { code: 'lo', name: 'ລາວ', english: 'Lao', og: 'lo_LA' },
  { code: 'lt', name: 'Lietuvių', english: 'Lithuanian', og: 'lt_LT' },
  { code: 'lv', name: 'Latviešu', english: 'Latvian', og: 'lv_LV' },
  { code: 'mk', name: 'Македонски', english: 'Macedonian', og: 'mk_MK' },
  { code: 'ml', name: 'മലയാളം', english: 'Malayalam', og: 'ml_IN' },
  { code: 'mn', name: 'Монгол', english: 'Mongolian', og: 'mn_MN' },
  { code: 'mr', name: 'मराठी', english: 'Marathi', og: 'mr_IN' },
  { code: 'ms', name: 'Bahasa Melayu', english: 'Malay', og: 'ms_MY' },
  { code: 'my', name: 'မြန်မာ', english: 'Burmese', og: 'my_MM' },
  { code: 'nb', name: 'Norsk bokmål', english: 'Norwegian Bokmål', og: 'nb_NO' },
  { code: 'ne', name: 'नेपाली', english: 'Nepali', og: 'ne_NP' },
  { code: 'nl', name: 'Nederlands', english: 'Dutch', og: 'nl_NL' },
  { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia', og: 'or_IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi', og: 'pa_IN' },
  { code: 'pl', name: 'Polski', english: 'Polish', og: 'pl_PL' },
  { code: 'ps', name: 'پښتو', english: 'Pashto', og: 'ps_AF', dir: 'rtl' },
  { code: 'pt', name: 'Português (Brasil)', english: 'Portuguese (Brazil)', og: 'pt_BR' },
  { code: 'ro', name: 'Română', english: 'Romanian', og: 'ro_RO' },
  { code: 'ru', name: 'Русский', english: 'Russian', og: 'ru_RU' },
  { code: 'si', name: 'සිංහල', english: 'Sinhala', og: 'si_LK' },
  { code: 'sk', name: 'Slovenčina', english: 'Slovak', og: 'sk_SK' },
  { code: 'sl', name: 'Slovenščina', english: 'Slovenian', og: 'sl_SI' },
  { code: 'so', name: 'Soomaali', english: 'Somali', og: 'so_SO' },
  { code: 'sq', name: 'Shqip', english: 'Albanian', og: 'sq_AL' },
  { code: 'sr', name: 'Српски', english: 'Serbian', og: 'sr_RS' },
  { code: 'sv', name: 'Svenska', english: 'Swedish', og: 'sv_SE' },
  { code: 'sw', name: 'Kiswahili', english: 'Swahili', og: 'sw_TZ' },
  { code: 'ta', name: 'தமிழ்', english: 'Tamil', og: 'ta_IN' },
  { code: 'te', name: 'తెలుగు', english: 'Telugu', og: 'te_IN' },
  { code: 'th', name: 'ไทย', english: 'Thai', og: 'th_TH' },
  { code: 'tr', name: 'Türkçe', english: 'Turkish', og: 'tr_TR' },
  { code: 'uk', name: 'Українська', english: 'Ukrainian', og: 'uk_UA' },
  { code: 'ur', name: 'اردو', english: 'Urdu', og: 'ur_PK', dir: 'rtl' },
  { code: 'uz', name: 'O‘zbekcha', english: 'Uzbek', og: 'uz_UZ' },
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', og: 'vi_VN' },
  { code: 'zh', name: '简体中文', english: 'Chinese (Simplified)', og: 'zh_CN' },
  { code: 'zh-Hant', name: '繁體中文', english: 'Chinese (Traditional)', og: 'zh_TW' },
  { code: 'zu', name: 'isiZulu', english: 'Zulu', og: 'zu_ZA' },
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
