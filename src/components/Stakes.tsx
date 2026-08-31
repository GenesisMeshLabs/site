'use client';
import { useTranslations } from 'next-intl';

export default function Stakes() {
  const t = useTranslations('stakes');

  return (
    <section id="stakes">
      <div className="slabel rv">
        <i>01</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <div className="not-line rv">{t('notLine')}</div>
      <div className="stat-row rv">
        <div className="stat">
          <div className="num">{t('stats.one')}</div>
          <div className="cap">{t('stats.oneDesc')}</div>
        </div>
        <div className="stat">
          <div className="num">{t('stats.two')}</div>
          <div className="cap">{t('stats.twoDesc')}</div>
        </div>
        <div className="stat">
          <div className="num">{t('stats.three')}</div>
          <div className="cap">{t('stats.threeDesc')}</div>
        </div>
      </div>
    </section>
  );
}
