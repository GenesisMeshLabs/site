import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales, defaultLocale, rtlLocales, type Locale } from '../../i18n';
import { SITE_URL, localeUrl, OG_LOCALES } from '../../seo';
import '../../globals.css';

/** Unknown locales 404 instead of being rendered on demand. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });

  // hreflang map: every locale plus x-default pointing at the unprefixed root.
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, localeUrl(code)])
  );
  languages['x-default'] = localeUrl(defaultLocale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | Genesis Mesh`,
    },
    description: t('description'),
    applicationName: 'Genesis Mesh',
    keywords: t('keywords').split('|'),
    authors: [{ name: 'Genesis Mesh Contributors' }],
    creator: 'Genesis Mesh Labs',
    publisher: 'Genesis Mesh Labs',
    alternates: {
      canonical: localeUrl(locale),
      languages,
    },
    icons: {
      icon: [
        { url: '/assets/icons/favicon.ico', sizes: 'any' },
        { url: '/assets/icons/logo.svg', type: 'image/svg+xml' },
      ],
      apple: '/assets/icons/logo.png',
    },
    manifest: `/${locale}/manifest.webmanifest`,
    openGraph: {
      type: 'website',
      siteName: 'Genesis Mesh',
      title: t('title'),
      description: t('description'),
      url: localeUrl(locale),
      locale: OG_LOCALES[locale] ?? 'en_US',
      alternateLocale: locales.filter((c) => c !== locale).map((c) => OG_LOCALES[c]),
      images: [
        {
          url: '/assets/icons/logo.png',
          width: 1200,
          height: 630,
          alt: 'Genesis Mesh',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/assets/icons/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'seo' });
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Genesis Mesh Labs',
        url: SITE_URL,
        logo: `${SITE_URL}/assets/icons/logo.png`,
        sameAs: ['https://github.com/GenesisMeshLabs'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Genesis Mesh',
        description: t('description'),
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: locales as unknown as string[],
      },
      {
        '@type': 'WebPage',
        '@id': `${localeUrl(locale)}#webpage`,
        url: localeUrl(locale),
        name: t('title'),
        description: t('description'),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: locale,
      },
    ],
  };

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,200;6..72,300;6..72,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Arabic:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0c0c0d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
