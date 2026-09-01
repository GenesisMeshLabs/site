'use client';
import { useTranslations } from 'next-intl';

type Operation = {
  num: string;
  name: string;
  desc: string;
};

type EvidenceItem = {
  title: string;
  action: string;
};

const EVIDENCE_LINKS = [
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/genesis_mesh/tests/test_cli_proof_ops.py',
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/assets/scripts/cross-sovereign-revocation-demo.py',
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/formal-verification.md',
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/concepts/comparison.md',
] as const;

export default function Mechanics() {
  const t = useTranslations('mechanics');
  const ops = t.raw('ops') as Operation[];
  const evidence = t.raw('evidence') as EvidenceItem[];

  return (
    <section id="mechanics">
      <div className="slabel rv">
        <i>02</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>
      <div className="mech rv">
        {ops.map((op) => (
          <div key={op.num} className="mcell">
            <div className="n">/ {op.num}</div>
            <h4>{op.name}</h4>
            <p>{op.desc}</p>
          </div>
        ))}
      </div>
      <div className="evidence-links rv">
        {evidence.map((item, idx) => (
          <a key={item.title} href={EVIDENCE_LINKS[idx]} target="_blank" rel="noopener noreferrer">
            <strong>{item.title}</strong>
            <span>{item.action}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
