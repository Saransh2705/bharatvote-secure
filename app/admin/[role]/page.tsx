import { Vote, Users, BarChart3, FileText } from 'lucide-react';
import StatCard from '@/components/StatCard';
import AdminLayout from '@/components/AdminLayout';
import type { AdminRole } from '@/lib/mockData';
import { createServerSupabaseClient } from '@/lib/supabase';
import DashboardCharts from './DashboardCharts';

export default async function AdminDashboardPage({ params }: { params: Promise<{ role: AdminRole }> }) {
  const { role } = await params;

  // Real dashboard data from the database (service role, server-side).
  const admin = createServerSupabaseClient();
  const count = async (table: string, eq?: [string, string]) => {
    let q = admin.from(table).select('*', { count: 'exact', head: true });
    if (eq) q = q.eq(eq[0], eq[1]);
    const { count } = await q;
    return count ?? 0;
  };

  const [activeElections, registeredVoters, votesCast, documents] = await Promise.all([
    count('elections', ['status', 'active']),
    count('users'),
    count('votes'),
    count('documents'),
  ]);

  const { data: cands } = await admin.from('candidates').select('votes, election:elections ( election_type )');
  const byMap: Record<string, number> = {};
  (cands ?? []).forEach((c: any) => {
    const name = c.election?.election_type || 'Unknown';
    byMap[name] = (byMap[name] || 0) + (c.votes || 0);
  });
  const turnoutData = Object.entries(byMap).map(([name, votes]) => ({ name: name.replace(' Election', ''), votes }));

  const { data: recent } = await admin
    .from('votes')
    .select('confirmation_id, voted_at, election:elections ( election_type )')
    .order('voted_at', { ascending: false })
    .limit(5);

  return (
    <AdminLayout role={role}>
      <div>
        <h1 className="text-2xl font-heading font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Vote} label="Active Elections" value={activeElections} />
          <StatCard icon={Users} label="Registered Voters" value={registeredVoters} />
          <StatCard icon={BarChart3} label="Votes Cast" value={votesCast} />
          <StatCard icon={FileText} label="Documents" value={documents} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="govt-card p-6">
            <h3 className="font-heading font-semibold mb-4">Votes by Election</h3>
            <DashboardCharts data={turnoutData} />
          </div>

          <div className="govt-card p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {(recent ?? []).map((r: any) => (
                <div key={r.confirmation_id} className="flex items-center gap-3 text-sm">
                  <Vote className="h-4 w-4 text-primary shrink-0" />
                  <span className="flex-1">Vote recorded — {r.election?.election_type || 'Election'} <span className="text-muted-foreground">({r.confirmation_id})</span></span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.voted_at).toLocaleDateString('en-IN')}</span>
                </div>
              ))}
              {(!recent || recent.length === 0) && (
                <p className="text-sm text-muted-foreground">No votes recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
