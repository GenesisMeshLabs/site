'use client';
import { useTranslations } from 'next-intl';
import SovereigMap from './SovereignMap';

export default function Protocol() {
  const t = useTranslations('protocol');
  const rfcs = t.raw('rfcs') as any[];

  return (
    <section id="protocol">
      <div className="slabel rv">
        <i>04</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="stack-section rv">
        <h3 className="stack-title">{t('stack.title')}</h3>
        <div className="stack">
          {(['l3', 'l2', 'l1'] as const).map((tier) => {
            // Each string is "L1 - Name. Description." Split so the tier code
            // and its name can carry the visual weight.
            const raw = t(`stack.${tier}`);
            const [head, ...rest] = raw.split('. ');
            const [code, name] = head.split(/\s-\s(.+)/);
            return (
              <div className="stack-tier" key={tier}>
                <span className="stack-code">{code}</span>
                <div className="stack-body">
                  <span className="stack-name">{name ?? head}</span>
                  <span className="stack-desc">{rest.join('. ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rfc-list rv">
        {rfcs.map((rfc, idx) => (
          <a key={idx} className="rfc" href="https://genesismesh.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
            <span className="id">{rfc.id}</span>
            <span className="name">{rfc.name}</span>
            <span className="st">{rfc.status}</span>
          </a>
        ))}
      </div>

      <div className="live rv" id="livesov">
        <div className="live-head">
          <span>
            <span className="live-dot"></span>
            {t('live.title')}
          </span>
          <span>{t('live.subtitle')}</span>
        </div>
        <SovereigMap />
        <div className="live-foot">
          <span>{t('live.sovereigns')} <b>4</b></span>
          <span>{t('live.clouds')} <b>Azure - DigitalOcean - Cloudflare - Akamai/Linode</b></span>
          <span>{t('live.edges')} <b>Signed & Revocable</b></span>
          <span>{t('live.operators')} <b>{t('live.status')}</b></span>
        </div>
      </div>
    </section>
  );
}
