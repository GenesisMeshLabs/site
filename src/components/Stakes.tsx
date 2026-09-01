'use client';
import { useTranslations } from 'next-intl';

export default function Stakes() {
  const t = useTranslations('stakes');

  return (
    <section id="stakes">
      <div className="slabel rv">
        <i>05</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <div className="not-line rv">{t('notLine')}</div>
      <p className="lead rv stakes-boundary">{t('boundary')}</p>
    </section>
  );
}
