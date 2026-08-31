'use client';
import { useTranslations } from 'next-intl';

/**
 * The proof numbers carry the section, so they are lifted out of the prose
 * into a scannable band. Values are deliberately not translated: a version
 * string and test counts read the same in every language.
 */
const PROOF = [
  { value: 'v0.55.0', key: 'version' },
  { value: '3', key: 'cycles' },
  { value: '1,041', key: 'tests' },
  { value: '8', key: 'lemmas' },
] as const;

const PLATFORMS = ['Akamai', 'Cloudflare', 'MongoDB Atlas', 'Salesforce', 'SAP'];
const SUBSTRATE = ['Azure', 'GCP', 'VMware', 'AWS'];

export default function Live() {
  const t = useTranslations('live');

  return (
    <section id="live">
      <div className="slabel rv">
        <i>06</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="proof-row rv">
        {PROOF.map((p) => (
          <div className="proof" key={p.key}>
            <div className="proof-v">{p.value}</div>
            <div className="proof-k">{t(`proof.${p.key}`)}</div>
          </div>
        ))}
      </div>

      <div className="platforms rv">
        <div className="platform-group">
          <span className="platform-label">{t('across')}</span>
          <span className="platform-list">{PLATFORMS.join(' · ')}</span>
        </div>
        <div className="platform-group">
          <span className="platform-label">{t('over')}</span>
          <span className="platform-list">{SUBSTRATE.join(' · ')}</span>
        </div>
      </div>
    </section>
  );
}
