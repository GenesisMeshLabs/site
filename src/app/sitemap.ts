import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '../i18n';
import { localeUrl } from '../seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, localeUrl(code)])
  );
  languages['x-default'] = localeUrl(defaultLocale);

  return locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}

export const dynamic = 'force-static';
