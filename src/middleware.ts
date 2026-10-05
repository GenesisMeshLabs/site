import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // `/` always serves English. Every locale has its own URL with hreflang
  // alternates, so nothing redirects by browser language or a remembered
  // cookie: search engines advise against it, since a crawler that is
  // redirected may never see the page at `/`. Without detection the
  // middleware sets no locale cookie (nor does the language picker, see
  // src/navigation.ts).
  localeDetection: false,
  // Metadata and the sitemap already emit hreflang alternates. Disabling the
  // duplicate response header keeps it bounded as the locale registry grows.
  alternateLinks: false,
});

export const config = {
  // Everything except API routes, Next internals, and anything with a file
  // extension (assets, /favicon.ico, /.well-known/... attestation files).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
