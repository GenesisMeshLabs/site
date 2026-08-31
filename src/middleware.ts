import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  // Everything except API routes, Next internals, and anything with a file
  // extension (assets, /favicon.ico, /.well-known/... attestation files).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
