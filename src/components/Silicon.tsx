'use client';
import { useTranslations } from 'next-intl';

export default function Silicon() {
  const t = useTranslations('silicon');

  return (
    <section id="silicon">
      <div className="slabel rv">
        <i>05</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <p className="lead rv" style={{ marginTop: '28px' }}>{t('conclusion')}</p>
      <div style={{ marginTop: '28px' }}>
        <a href="#" className="btn">{t('cta')}</a>
      </div>
    </section>
  );
}
