'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/navigation';
import LanguageSelector from './LanguageSelector';

export default function Nav() {
  const t = useTranslations();

  return (
    <nav>
      <Link href="/" className="brand-logo">
        <Image
          src="/assets/icons/logo.svg"
          alt="Genesis Mesh"
          width={32}
          height={32}
          priority
        />
      </Link>
      <div className="nav-right">
        <ul>
          <li><a href="#stakes">{t('nav.links.stakes')}</a></li>
          <li><a href="#powers">{t('nav.links.powers')}</a></li>
          <li><a href="#mechanics">{t('nav.links.mechanics')}</a></li>
          <li><a href="#protocol">{t('nav.links.protocol')}</a></li>
          <li><a href="#silicon">{t('nav.links.hardware')}</a></li>
          <li><a href="https://genesismesh.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
            {t('nav.links.docs')} ↗
          </a></li>
        </ul>
        <LanguageSelector />
      </div>
    </nav>
  );
}
