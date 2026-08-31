'use client';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { locales } from '@/i18n';

const NAMES: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  ru: 'Русский',
  pt: 'Português',
  ko: '한국어',
};

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lang-selector">
      <button
        type="button"
        className="lang-toggle"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
      >
        {locale.toUpperCase()}
      </button>

      {open && (
        <ul className="lang-menu">
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={pathname}
                locale={code}
                className={`lang-link ${locale === code ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {NAMES[code]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
