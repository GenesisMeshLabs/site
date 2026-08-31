import { defaultLocale, isRtl, locales } from '@/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params: { locale } }: { params: { locale: string } }
) {
  if (!locales.includes(locale)) {
    return new Response(null, { status: 404 });
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const startUrl = locale === defaultLocale ? '/' : `/${locale}`;

  return Response.json(
    {
      name: 'Genesis Mesh',
      short_name: 'Genesis Mesh',
      description: messages.seo.description,
      lang: locale,
      dir: isRtl(locale) ? 'rtl' : 'ltr',
      start_url: startUrl,
      display: 'standalone',
      background_color: '#0c0c0d',
      theme_color: '#0c0c0d',
      icons: [
        {
          src: '/assets/icons/logo.png',
          sizes: 'any',
          type: 'image/png',
        },
        {
          src: '/assets/icons/logo.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
    {
      headers: {
        'content-type': 'application/manifest+json; charset=utf-8',
        'cache-control': 'public, max-age=3600, s-maxage=86400',
      },
    }
  );
}
