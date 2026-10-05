import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix: 'as-needed',
  // The middleware does not detect a locale (src/middleware.ts), so switching
  // language does not store the choice in a cookie either.
  localeCookie: false,
});
