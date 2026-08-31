'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import LanguageSelector from './LanguageSelector';

const SECTIONS = [
  { href: '#stakes', key: 'stakes' },
  { href: '#powers', key: 'powers' },
  { href: '#mechanics', key: 'mechanics' },
  { href: '#protocol', key: 'protocol' },
  { href: '#silicon', key: 'hardware' },
] as const;

export default function Nav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  // Lock the page behind the mobile sheet, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav>
      <Link href="/" className="brand" aria-label="Genesis Mesh">
        <Image src="/assets/icons/logo.svg" alt="" width={28} height={28} priority />
        <span className="brand-word">
          GENESIS<em>■</em>MESH
        </span>
      </Link>

      <div className="nav-right">
        <ul className="nav-links">
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <a href={s.href}>{t(`nav.links.${s.key}`)}</a>
            </li>
          ))}
          <li>
            <a href="https://genesismesh.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
              {t('nav.links.docs')} ↗
            </a>
          </li>
        </ul>

        <LanguageSelector />

        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`burger-bars ${open ? 'is-open' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-nav" className={`nav-sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <a href={s.href} onClick={() => setOpen(false)}>
                {t(`nav.links.${s.key}`)}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://genesismesh.connectorzzz.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              {t('nav.links.docs')} ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
