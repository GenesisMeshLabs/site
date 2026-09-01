'use client';
import { useTranslations } from 'next-intl';
import MeshCanvas from './MeshCanvas';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <header className="hero">
      <MeshCanvas />
      <span className="vlabel">{t('vlabel')}</span>
      <div className="hero-inner">
        <div className="kicker rv">
          {t('kicker')}
        </div>
        <h1 className="rv">
          {t('title')}<br />
          <span className="accent">{t('titleAccent')}</span>
        </h1>
        <p className="hero-sub rv">
          {t('subtitle')}
        </p>
        <div className="hero-actions rv">
          <a
            className="hero-action hero-action-primary"
            href="https://genesismesh.connectorzzz.com/rfcs/rfc-002-recognition-treaties.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('actions.protocol')}
          </a>
          <a
            className="hero-action"
            href="https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/cross-sovereign-revocation.md#run"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('actions.run')}
          </a>
          <a className="hero-action" href="#live-network">
            {t('actions.network')}
          </a>
        </div>
        <div className="hero-meta rv">
          <div>{t('meta.verify')}<b>{t('meta.verifyDesc')}</b></div>
          <div>{t('meta.limit')}<b>{t('meta.limitDesc')}</b></div>
          <div>{t('meta.revoke')}<b>{t('meta.revokeDesc')}</b></div>
          <div>{t('meta.audit')}<b>{t('meta.auditDesc')}</b></div>
        </div>
      </div>
      <div className="scroll-hint">{t('scroll')}</div>
    </header>
  );
}
