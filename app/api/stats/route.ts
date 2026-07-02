import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET /api/stats — real aggregate counts for the home + admin dashboards.
export async function GET() {
  try {
    const admin = createServerSupabaseClient();
    const count = async (table: string, eq?: [string, string]) => {
      let q = admin.from(table).select('*', { count: 'exact', head: true });
      if (eq) q = q.eq(eq[0], eq[1]);
      const { count } = await q;
      return count ?? 0;
    };

    const [activeElections, totalElections, registeredVoters, votesCast, documents] = await Promise.all([
      count('elections', ['status', 'active']),
      count('elections'),
      count('users'),
      count('votes'),
      count('documents'),
    ]);

    // Votes per election (sum of candidate tallies) for the turnout chart.
    const { data: cands } = await admin.from('candidates').select('votes, election:elections ( election_type )');
    const byMap: Record<string, number> = {};
    (cands ?? []).forEach((c: any) => {
      const name = c.election?.election_type || 'Unknown';
      byMap[name] = (byMap[name] || 0) + (c.votes || 0);
    });
    const byElection = Object.entries(byMap).map(([name, votes]) => ({
      name: name.replace(' Election', ''),
      votes,
    }));

    // Recent votes for the activity feed.
    const { data: recent } = await admin
      .from('votes')
      .select('confirmation_id, voted_at, election:elections ( election_type )')
      .order('voted_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: { activeElections, totalElections, registeredVoters, votesCast, documents, byElection, recent: recent ?? [] },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
