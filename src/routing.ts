import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';

/**
 * Locale routing, shared by the proxy (src/proxy.ts) and the navigation
 * helpers (src/navigation.ts).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // `/` always serves English. Every locale has its own URL with hreflang
  // alternates, so nothing redirects by browser language or a remembered
  // cookie: search engines advise against it, since a crawler that is
  // redirected may never see the page at `/`. No locale cookie is set either,
  // by the proxy or by the language picker.
  localeDetection: false,
  localeCookie: false,
  // Metadata and the sitemap already emit hreflang alternates. Disabling the
  // duplicate response header keeps it bounded as the locale registry grows.
  alternateLinks: false,
});
