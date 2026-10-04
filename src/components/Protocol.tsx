'use client';
import { useLocale, useTranslations } from 'next-intl';
import SovereigMap from './SovereignMap';
import { LINKS } from '@/lib/links';
import release from '@/generated/release.json';

const RFC_FILES: Record<string, string> = {
  'RFC-001': 'rfc-001-sovereign-identity',
  'RFC-002': 'rfc-002-recognition-treaties',
  'RFC-003': 'rfc-003-trust-bundles',
  'RFC-004': 'rfc-004-revocation-feeds',
  'RFC-005': 'rfc-005-capability-manifests',
  'RFC-006': 'rfc-006-connectome-model',
  'RFC-007': 'rfc-007-operator-continuity',
  'RFC-008': 'rfc-008-managed-operator-role',
};

export default function Protocol() {
  const t = useTranslations('protocol');
  const rfcs = t.raw('rfcs') as any[];
  const locale = useLocale();
  // Generated at build time from the latest release (scripts/release-facts.mjs).
  const facts = {
    version: release.version,
    tests: new Intl.NumberFormat(locale).format(release.tests),
  };

  return (
    <section id="protocol">
      <div className="slabel rv">
        <i>04</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle', facts)}</p>

      <div className="stack-section rv">
        <h3 className="stack-title">{t('stack.title')}</h3>
        <div className="stack">
          {(['l3', 'l2', 'l1'] as const).map((tier) => (
            <div className="stack-tier" key={tier}>
              <span className="stack-code">{t(`stack.${tier}.code`)}</span>
              <div className="stack-body">
                <span className="stack-name">{t(`stack.${tier}.name`)}</span>
                <span className="stack-desc">{t(`stack.${tier}.desc`)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rfc-list rv">
        {rfcs.map((rfc, idx) => (
          <a key={idx} className="rfc" href={`${LINKS.docs}/rfcs/${RFC_FILES[rfc.id] ?? 'index'}.html`} target="_blank" rel="noopener noreferrer">
            <span className="id">{rfc.id}</span>
            <span className="name">{rfc.name}</span>
            <span className="st">{rfc.status}</span>
          </a>
        ))}
      </div>

      <div className="governance-block rv">
        <div>
          <span className="governance-label">{t('governance.label')}</span>
          <h3>{t('governance.title')}</h3>
          <p>{t('governance.description')}</p>
          <p className="governance-boundary">{t('governance.boundary')}</p>
        </div>
        <a
          className="btn"
          href="https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/development/governance.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('governance.cta')}
        </a>
      </div>

      <div className="live rv" id="livesov">
        <div className="live-head">
          <span>
            <span className="live-dot"></span>
            {t('live.title')}
          </span>
          <span>{t('live.subtitle')}</span>
        </div>
        <SovereigMap networkLabel={t('live.network')} onlineLabel={t('live.online')} />
        <div className="live-foot">
          <span>{t('live.sovereigns')} <b>4</b></span>
          <span>{t('live.clouds')} <b>Azure - DigitalOcean - Cloudflare - Akamai/Linode</b></span>
          <span>{t('live.edges')} <b>{t('live.edgeStatus')}</b></span>
          <span>{t('live.operators')} <b>{t('live.status')}</b></span>
        </div>
      </div>
    </section>
  );
}
