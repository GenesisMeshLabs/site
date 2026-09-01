import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AUTHORITY_URL = 'https://na.genesismesh.connectorzzz.com';
const REQUEST_TIMEOUT_MS = 5000;

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

async function fetchJson(path: string, signal: AbortSignal) {
  const response = await fetch(`${AUTHORITY_URL}${path}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) throw new Error(`Authority returned ${response.status}`);
  return response.json() as Promise<unknown>;
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const [healthValue, dashboardValue] = await Promise.all([
      fetchJson('/healthz', controller.signal),
      fetchJson('/dashboard.json', controller.signal),
    ]);

    const health = asRecord(healthValue);
    const dashboard = asRecord(dashboardValue);
    const connectome = asRecord(dashboard.connectome_summary);
    const treaties = asRecord(dashboard.treaty_summary);
    const feeds = asRecord(dashboard.revocation_feed_summary);
    const trustCycle = asRecord(dashboard.trust_cycle_summary);
    const recentChanges = Array.isArray(dashboard.recent_changes)
      ? dashboard.recent_changes.map(asRecord)
      : [];

    const latestChange = recentChanges
      .map((change) => asString(change.created_at))
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;

    return NextResponse.json(
      {
        available: true,
        health: asString(health.status) === 'ok' ? 'healthy' : 'degraded',
        sovereignDomains: asNumber(connectome.sovereign_count),
        recognitionEdges: asNumber(connectome.recognition_edge_count),
        activeTreaties: asNumber(treaties.active),
        revocations: asNumber(connectome.revoked_trust_material_count),
        checkedAt: new Date().toISOString(),
        lastUpdatedAt: latestChange,
        revocationFeed: {
          freshness: asString(feeds.freshness) ?? 'unknown',
        },
        trustCycle: {
          status: asString(trustCycle.status) === 'verified' ? 'verified' : 'not_observed',
          completedAt: asString(trustCycle.completed_at),
          freshness: asString(trustCycle.freshness) ?? 'unknown',
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        available: false,
        checkedAt: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  } finally {
    clearTimeout(timeout);
  }
}
