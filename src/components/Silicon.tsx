'use client';
import { useTranslations } from 'next-intl';

export default function Silicon() {
  const t = useTranslations('silicon');

  return (
    <section id="silicon">
      <div className="slabel rv">
        <i>07</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <p className="lead rv silicon-conclusion">{t('conclusion')}</p>
      <div className="rv silicon-cta">
        {/* No briefing is published yet, so this opens the direct channel
            rather than pointing at a page that does not exist. */}
        <a
          className="btn"
          href="mailto:authority@genesismesh.org?subject=TSWI%20research%20briefing"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
