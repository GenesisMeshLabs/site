'use client';
import { useTranslations } from 'next-intl';

export default function Powers() {
  const t = useTranslations('powers');

  const powers = ['cn', 'us', 'kp'] as const;

  return (
    <section id="powers">
      <div className="slabel rv">
        <i>06</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="powers">
        {powers.map((key) => {
          const power = t.raw(key as any) as any;
          const benefits = power.benefits as string[];
          return (
            <article key={key} className="power rv">
              <div className="phead">
                <div className="code">{power.code}</div>
                <span className="tag">{power.tag}</span>
              </div>
              <h3>{power.title}</h3>
              <p>{power.desc}</p>
              <ul>
                {benefits.map((benefit: string, idx: number) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
