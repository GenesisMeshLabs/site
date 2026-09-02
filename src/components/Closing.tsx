'use client';
import { useTranslations } from 'next-intl';

export default function Closing() {
  const t = useTranslations('closing');

  return (
    <section className="closing">
      <h2 className="rv">
        {t('title')}<br />
        <span className="accent">{t('titleAccent')}</span>
      </h2>
      <p className="lead rv">{t('subtitle')}</p>
      <div className="audiences rv">
        <div className="aud">
          <div className="who">{t('builders.who')}</div>
          <h3>{t('builders.title')}</h3>
          <p>{t('builders.desc')}</p>
          <a className="btn primary" href="https://dev.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
            {t('builders.cta')}
          </a>
          <a className="alt" href="https://github.com/GenesisMeshLabs" target="_blank" rel="noopener noreferrer">
            {t('builders.altText')}
          </a>
        </div>
        <div className="aud">
          <div className="who">{t('strategic.who')}</div>
          <h3>{t('strategic.title')}</h3>
          <p>{t('strategic.desc')}</p>
          <a className="btn" href="mailto:authority@genesismesh.org?subject=Genesis%20Mesh">
            {t('strategic.altText')}
          </a>
        </div>
      </div>
    </section>
  );
}
