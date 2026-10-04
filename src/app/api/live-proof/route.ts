import { NextResponse } from 'next/server';
import { loadLiveProof } from '@/lib/live-proof';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await loadLiveProof();
  return NextResponse.json(data, {
    status: data.available ? 200 : 503,
    headers: {
      'Cache-Control': data.available ? 'public, s-maxage=30, stale-while-revalidate=60' : 'no-store',
    },
  });
}
