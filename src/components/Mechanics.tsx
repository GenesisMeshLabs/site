'use client';
import { useTranslations } from 'next-intl';

export default function Mechanics() {
  const t = useTranslations('mechanics');
  const ops = t.raw('ops') as any[];

  return (
    <section id="mechanics">
      <div className="slabel rv">
        <i>02</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <div className="mech rv">
        {ops.map((op, idx) => (
          <div key={idx} className="mcell">
            <div className="n">/ {op.num}</div>
            <h4>{op.name}</h4>
            <p>{op.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
