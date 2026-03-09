import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { candidates, elections } from '@/lib/mockData';
import CandidateCard from '@/components/CandidateCard';

const COLORS = ['#1a2a6c', '#FF9933', '#2d8f2d', '#888'];

export default function ResultsPage() {
  const [selectedElection, setSelectedElection] = useState('2');
  const completedOrActive = elections.filter(e => e.status === 'completed' || e.status === 'active');
  const electionCandidates = candidates.filter(c => c.election_id === selectedElection).sort((a, b) => b.votes - a.votes);
  const totalVotes = electionCandidates.reduce((sum, c) => sum + c.votes, 0);

  const barData = electionCandidates.map(c => ({ name: c.name.split(' ')[1] || c.name, votes: c.votes }));
  const pieData = electionCandidates.map(c => ({ name: c.party, value: c.votes }));

  return (
    <div className="govt-section">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-2">Election Results</h1>
        <p className="text-muted-foreground mb-6">Real-time vote counts and analytics</p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {completedOrActive.map(e => (
            <button
              key={e.id}
              onClick={() => setSelectedElection(e.id)}
              className={`px-4 py-2 text-sm rounded border transition-colors ${
                selectedElection === e.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'
              }`}
            >
              {e.election_type} — {e.state}
            </button>
          ))}
        </div>

        {electionCandidates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar chart */}
            <div className="govt-card p-6">
              <h3 className="font-heading font-semibold mb-4">Vote Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="hsl(224, 60%, 26%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="govt-card p-6">
              <h3 className="font-heading font-semibold mb-4">Vote Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Candidate ranking */}
            <div className="lg:col-span-2">
              <h3 className="font-heading font-semibold mb-4">Candidate Rankings</h3>
              <div className="space-y-3">
                {electionCandidates.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className={`text-lg font-bold w-8 text-center ${i === 0 ? 'text-saffron' : 'text-muted-foreground'}`}>#{i + 1}</span>
                    <div className="flex-1">
                      <CandidateCard candidate={c} showVotes />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Total votes cast: {totalVotes.toLocaleString()} | Turnout: 67.3%</div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No results available for this election yet.</p>
        )}
      </div>
    </div>
  );
}
