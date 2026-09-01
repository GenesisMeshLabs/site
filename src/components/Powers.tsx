'use client';
import { useTranslations } from 'next-intl';

type Scenario = {
  code: string;
  tag: string;
  title: string;
  desc: string;
  examples: string[];
};

const SCENARIO_KEYS = ['close', 'scoped', 'different'] as const;

export default function Powers() {
  const t = useTranslations('powers');

  return (
    <section id="powers">
      <div className="slabel rv">
        <i>06</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="powers">
        {SCENARIO_KEYS.map((key) => {
          const scenario = t.raw(key) as Scenario;
          return (
            <article key={key} className="power rv">
              <div className="phead">
                <div className="code">{scenario.code}</div>
                <span className="tag">{scenario.tag}</span>
              </div>
              <h3>{scenario.title}</h3>
              <p>{scenario.desc}</p>
              <ul>
                {scenario.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
