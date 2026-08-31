'use client';

import { useTranslations } from 'next-intl';

type TrustStep = {
  title: string;
  description: string;
};

const RECORDED_PROOF_URL =
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/independent-sovereigns.md';
const RUN_PROOF_URL =
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/cross-sovereign-revocation.md#run';
const PROTOCOL_URL =
  'https://genesismesh.connectorzzz.com/rfcs/rfc-002-recognition-treaties.html';

const RECORDED_OUTPUT = `Azure accepted NB attestation before revocation
accepted: True
reason: accepted

NB revoked the same attestation
reason: final_independent_sovereign_proof_revocation

Azure imported NB revocation feed
accepted: True
sequence: 1

Azure rejected the same attestation after feed import
accepted: False
reason: attestation_locally_revoked

Result: independent-sovereign proof passed across Azure and DigitalOcean VMs.`;

export default function TrustCycle() {
  const t = useTranslations('trustCycle');
  const steps = t.raw('steps') as TrustStep[];

  return (
    <section id="proof" className="trust-cycle-section">
      <div className="slabel rv">
        <i>01</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="trust-cycle rv">
        <ol className="trust-steps">
          {steps.map((step, index) => (
            <li key={step.title} className="trust-step" role="listitem">
              <span className="trust-step-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="trust-result" aria-label={t('sameRequest')}>
          <div className="trust-result-kicker">{t('sameRequest')}</div>
          <div className="trust-decision trust-decision-before">
            <span>{t('before')}</span>
            <strong>{t('accepted')}</strong>
            <code>reason: accepted</code>
          </div>
          <div className="trust-state-change" aria-hidden="true">↓</div>
          <div className="trust-decision trust-decision-after">
            <span>{t('after')}</span>
            <strong>{t('rejected')}</strong>
            <code>reason: attestation_locally_revoked</code>
          </div>
        </div>
      </div>

      <div className="proof-boundaries rv">
        <article>
          <span>{t('evidence.recorded.label')}</span>
          <h3>{t('evidence.recorded.title')}</h3>
          <p>{t('evidence.recorded.description')}</p>
        </article>
        <article>
          <span>{t('evidence.reproducible.label')}</span>
          <h3>{t('evidence.reproducible.title')}</h3>
          <p>{t('evidence.reproducible.description')}</p>
        </article>
        <article>
          <span>{t('evidence.live.label')}</span>
          <h3>{t('evidence.live.title')}</h3>
          <p>{t('evidence.live.description')}</p>
        </article>
      </div>

      <details className="recorded-terminal rv">
        <summary>{t('terminalSummary')}</summary>
        <pre dir="ltr"><code>{RECORDED_OUTPUT}</code></pre>
      </details>

      <div className="proof-run rv">
        <div>
          <span className="proof-run-label">{t('runLabel')}</span>
          <code dir="ltr">python docs/examples/assets/scripts/cross-sovereign-revocation-demo.py</code>
        </div>
        <div className="proof-actions">
          <a href={RECORDED_PROOF_URL} target="_blank" rel="noopener noreferrer">
            {t('actions.recorded')}
          </a>
          <a href={RUN_PROOF_URL} target="_blank" rel="noopener noreferrer">
            {t('actions.run')}
          </a>
          <a href={PROTOCOL_URL} target="_blank" rel="noopener noreferrer">
            {t('actions.protocol')}
          </a>
        </div>
      </div>
    </section>
  );
}
