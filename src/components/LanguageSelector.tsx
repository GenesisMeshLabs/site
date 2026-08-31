'use client';
import { useLocale } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { LOCALES } from '@/i18n';

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = LOCALES.find((l) => l.code === locale);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOCALES;
    // Match the endonym, the English name, or the code, so "de", "German" and
    // "Deutsch" all find the same entry.
    return LOCALES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.english.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [query]);

  // Focus the search box when the menu opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery('');
  }, [open]);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-selector" ref={rootRef}>
      {open && (
        <div className="lang-panel">
          <input
            ref={inputRef}
            type="search"
            className="lang-search"
            placeholder="Search languages"
            aria-label="Search languages"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ul className="lang-menu">
            {results.map((l) => (
              <li key={l.code}>
                <Link
                  href={pathname}
                  locale={l.code}
                  hrefLang={l.code}
                  dir={l.dir === 'rtl' ? 'rtl' : 'ltr'}
                  className={`lang-link ${locale === l.code ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="lang-name">{l.name}</span>
                  <span className="lang-english">{l.english}</span>
                </Link>
              </li>
            ))}
            {results.length === 0 && <li className="lang-empty">No match</li>}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="lang-toggle"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-toggle-code">{locale.toUpperCase()}</span>
        <span className="lang-toggle-name">{current?.name ?? locale}</span>
      </button>
    </div>
  );
}
