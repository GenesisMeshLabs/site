import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar', 'zh', 'es', 'fr', 'de', 'ja', 'ru', 'pt', 'ko'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const rtlLocales: string[] = ['ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
