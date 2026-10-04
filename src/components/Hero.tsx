'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import MeshCanvas from './MeshCanvas';
import { INSTALL_COMMANDS, LINKS } from '@/lib/links';

const RFC_URL = LINKS.rfc002;
const DEV_HUB_URL = LINKS.sdks;
const RUN_URL =
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/cross-sovereign-revocation.md#run';
const CHANNEL_URL = 'mailto:authority@genesismesh.org?subject=Genesis%20Mesh';

export default function Hero() {
  const t = useTranslations('hero');
  const questions = t.raw('questions') as string[];
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(INSTALL_COMMANDS).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

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
          {t('intro')}
        </p>
        <ul className="hero-questions rv">
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <p className="hero-statement rv">{t('statement')}</p>
        <p className="hero-sub rv">
          {t('body')}
        </p>
        <div className="not-line rv">{t('notLine')}</div>
        <p className="hero-closing rv">{t('closing')}</p>
        <div className="hero-try rv">
          <div className="hero-try-actions">
            <a className="btn primary" href={LINKS.liveMesh} target="_blank" rel="noopener noreferrer">
              {t('tryIt.primary')} →
            </a>
            <a className="btn" href={LINKS.quickstart} target="_blank" rel="noopener noreferrer">
              {t('tryIt.docs')}
            </a>
            <a className="btn" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <div className="hero-install">
            <span className="hero-install-label">{t('tryIt.local')}</span>
            <pre dir="ltr"><code>{INSTALL_COMMANDS}</code></pre>
            <button type="button" className="hero-install-copy" onClick={copy}>
              {copied ? t('tryIt.copied') : t('tryIt.copy')}
            </button>
          </div>
        </div>
        <div className="hero-audiences rv">
          <div className="hero-audience">
            <span className="hero-audience-label">{t('audiences.builders.label')}</span>
            <span className="hero-audience-links">
              <a href={RFC_URL} target="_blank" rel="noopener noreferrer">
                {t('audiences.builders.rfcs')}
              </a>
              <span className="sep" aria-hidden="true">·</span>
              <a href={DEV_HUB_URL} target="_blank" rel="noopener noreferrer">
                {t('audiences.builders.sdks')}
              </a>
              <span className="sep" aria-hidden="true">·</span>
              <a href={RUN_URL} target="_blank" rel="noopener noreferrer">
                {t('audiences.builders.run')}
              </a>
            </span>
          </div>
          <div className="hero-audience">
            <span className="hero-audience-label">{t('audiences.states.label')}</span>
            <span className="hero-audience-links">
              <a href="#mechanics">{t('audiences.states.architecture')}</a>
              <span className="sep" aria-hidden="true">·</span>
              <a href={CHANNEL_URL}>{t('audiences.states.channel')}</a>
            </span>
          </div>
        </div>
      </div>
      <div className="scroll-hint">{t('scroll')}</div>
    </header>
  );
}
