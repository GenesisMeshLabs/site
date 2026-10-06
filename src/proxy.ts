import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, and anything with a file
  // extension (assets, /favicon.ico, /.well-known/... attestation files).
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
};
