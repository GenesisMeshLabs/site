const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // English, the default locale (src/i18n.ts), has no prefix: `/en` moves to
  // `/` permanently, so search engines treat them as one page. next-intl's
  // own redirect is temporary. Only the page moves: `/en/manifest.webmanifest`
  // stays where the English page links it.
  async redirects() {
    return [{ source: '/en', destination: '/', permanent: true }];
  },
};

module.exports = withNextIntl(nextConfig);
