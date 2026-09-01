'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type LiveProofData = {
  available: boolean;
  health?: 'healthy' | 'degraded';
  sovereignDomains?: number | null;
  recognitionEdges?: number | null;
  activeTreaties?: number | null;
  revocations?: number | null;
  checkedAt: string;
  lastUpdatedAt?: string | null;
  freshness?: string;
  trustCycle?: {
    status: 'verified' | 'not_observed';
    completedAt: string | null;
    freshness: string;
  };
};

const DASHBOARD_URL = 'https://na.genesismesh.connectorzzz.com/dashboard';
const RUN_PROOF_URL =
  'https://github.com/GenesisMeshLabs/genesismesh/blob/main/docs/examples/assets/scripts/cross-sovereign-revocation-demo.py';

export default function LiveNetwork() {
  const t = useTranslations('liveNetwork');
  const trustCycleT = useTranslations('trustCycle');
  const locale = useLocale();
  const [data, setData] = useState<LiveProofData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch('/api/live-proof', { cache: 'no-store' });
        const payload = (await response.json()) as LiveProofData;
        if (!response.ok || !payload.available) throw new Error('Live proof unavailable');
        if (active) {
          setData(payload);
          setFailed(false);
        }
      } catch {
        if (active) {
          setData(null);
          setFailed(true);
        }
      }
    };

    void load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const formatTime = (value?: string | null) => {
    if (!value) return t('unknown');
    const parsed = new Date(value);
    if (Number.isNaN(parsed.valueOf())) return t('unknown');
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  };

  const statusKey = failed
    ? 'unavailable'
    : !data
      ? 'checking'
      : data.health === 'degraded'
        ? 'degraded'
        : data.trustCycle?.status !== 'verified' || data.trustCycle.freshness !== 'fresh'
          ? 'stale'
          : 'live';

  const trustCycleFresh =
    data?.trustCycle?.status === 'verified' && data.trustCycle.freshness === 'fresh';

  const metrics = [
    {
      key: 'health',
      value: data?.health ? t(`health.${data.health}`) : t('notReported'),
    },
    { key: 'sovereigns', value: data?.sovereignDomains ?? t('notReported') },
    { key: 'edges', value: data?.recognitionEdges ?? t('notReported') },
    { key: 'treaties', value: data?.activeTreaties ?? t('notReported') },
    { key: 'revocations', value: data?.revocations ?? t('notReported') },
  ] as const;

  return (
    <section id="live-network" className="live-network-section">
      <div className="slabel rv">
        <i>03</i> {t('label')}
      </div>
      <h2 className="rv">{t('title')}</h2>
      <p className="lead rv">{t('subtitle')}</p>

      <div className="live-network-panel rv" aria-live="polite">
        <div className="live-network-head">
          <div>
            <span className={`live-network-dot status-${statusKey}`} aria-hidden="true" />
            <strong>{t(`status.${statusKey}`)}</strong>
          </div>
          {data ? <span>{t('checked')}: {formatTime(data.checkedAt)}</span> : null}
        </div>

        {data ? (
          <div className="live-network-metrics">
            {metrics.map((metric) => (
              <div className="live-network-metric" key={metric.key}>
                <strong>{metric.value}</strong>
                <span>{t(`metrics.${metric.key}`)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="live-network-fallback">
            <strong>{t('browserFallback.title')}</strong>
            <p>{failed ? t('unavailableMessage') : t('browserFallback.description')}</p>
          </div>
        )}

        {data ? (
          <div className="live-network-meta">
            <span>{t('lastUpdate')}: {formatTime(data.lastUpdatedAt)}</span>
            <span>{trustCycleT('label')}: {formatTime(data.trustCycle?.completedAt)}</span>
            <span>{t('freshness')}: {t(`freshnessValues.${trustCycleFresh ? 'current' : 'stale'}`)}</span>
          </div>
        ) : null}

        <div className="live-network-foot">
          <p>{data ? t('disclaimer') : t('proofAvailability')}</p>
          <div className="live-network-actions">
            <a href={RUN_PROOF_URL} target="_blank" rel="noopener noreferrer">
              {trustCycleT('actions.run')}
            </a>
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
              {t('dashboard')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
