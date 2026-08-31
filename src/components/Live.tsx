'use client';
import { useTranslations } from 'next-intl';

export default function Live() {
  const t = useTranslations('live');

  return (
    <section>
      <div className="slabel rv">
        <i>06</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
    </section>
  );
}
