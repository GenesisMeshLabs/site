import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // Metadata and the sitemap already emit hreflang alternates. Disabling the
  // duplicate response header keeps it bounded as the locale registry grows.
  alternateLinks: false,
});

export const config = {
  // Everything except API routes, Next internals, and anything with a file
  // extension (assets, /favicon.ico, /.well-known/... attestation files).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
