"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CandidateCard from '@/components/CandidateCard';
import Layout from '@/components/Layout';
import { getUser, type BVUser } from '@/lib/session';

type VoteStep = 'select' | 'confirm' | 'done';

export default function VotingPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voteStep, setVoteStep] = useState<VoteStep>('select');
  const [confirmationId, setConfirmationId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<BVUser | null>(null);

  useEffect(() => {
    setUser(getUser());
    (async () => {
      try {
        const [er, cr] = await Promise.all([fetch('/api/elections?status=active'), fetch('/api/candidates')]);
        const [ej, cj] = await Promise.all([er.json(), cr.json()]);
        setElections(ej.data || []);
        setCandidates(cj.data || []);
        if ((ej.data || []).length) setSelectedElection(ej.data[0].id);
      } catch { /* ignore */ }
    })();
  }, []);

  const electionCandidates = candidates.filter(c => c.election_id === selectedElection);
  const chosen = candidates.find(c => c.id === selectedCandidate);

  async function castVote() {
    if (!user) { setError('Please register before voting.'); setVoteStep('select'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ election_id: selectedElection, candidate_id: selectedCandidate, voter_id: user.id }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || 'Failed to record vote'); setVoteStep('select'); }
      else { setConfirmationId(j.data.confirmation_id); setVoteStep('done'); }
    } catch {
      setError('Network error — please try again.'); setVoteStep('select');
    } finally {
      setSubmitting(false);
    }
  }

  if (voteStep === 'done') {
    return (
      <Layout>
        <div className="govt-section">
          <div className="container mx-auto px-4 max-w-lg text-center py-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle className="h-24 w-24 text-green-india mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold mb-2">Vote Recorded Successfully</h1>
            <div className="govt-card p-4 mt-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Your vote is encrypted and securely recorded</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Vote Confirmation ID: {confirmationId}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">Thank you for participating in the democratic process.</p>
            <Link href="/results" className="inline-block mt-4 text-primary underline text-sm">View live results →</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (voteStep === 'confirm') {
    return (
      <Layout>
        <div className="govt-section">
          <div className="container mx-auto px-4 max-w-lg">
            <h1 className="text-2xl font-heading font-bold mb-6">Confirm Your Vote</h1>
            <div className="govt-card p-6">
              <p className="text-sm text-muted-foreground mb-4">You are about to cast your vote for:</p>
              {chosen && <CandidateCard candidate={chosen} />}
              {error && <p className="text-sm text-red-600 mt-3 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setVoteStep('select')} className="flex-1" disabled={submitting}>Go Back</Button>
                <Button onClick={castVote} disabled={submitting} className="flex-1 bg-green-india hover:bg-green-india/90">
                  <Lock className="h-4 w-4 mr-2" /> {submitting ? 'Submitting…' : 'Confirm & Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-2xl font-heading font-bold mb-2">Cast Your Vote</h1>
          <p className="text-muted-foreground mb-6">Select an election and choose your candidate</p>

          {!user && (
            <div className="govt-card p-4 mb-6 border-l-4 border-saffron flex items-center justify-between gap-3">
              <span className="text-sm">You must be a registered voter to cast a vote.</span>
              <Link href="/register"><Button size="sm">Register</Button></Link>
            </div>
          )}
          {error && <p className="text-sm text-red-600 mb-4 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}

          <div className="flex gap-2 mb-6 flex-wrap">
            {elections.map(e => (
              <button
                key={e.id}
                onClick={() => { setSelectedElection(e.id); setSelectedCandidate(null); }}
                className={`px-4 py-2 text-sm rounded border transition-colors ${
                  selectedElection === e.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'
                }`}
              >
                {e.election_type}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {electionCandidates.map(c => (
              <CandidateCard
                key={c.id}
                candidate={c}
                selected={selectedCandidate === c.id}
                onSelect={() => setSelectedCandidate(c.id)}
              />
            ))}
            {electionCandidates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No candidates for this election yet.</p>
            )}
          </div>

          {selectedCandidate && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Button onClick={() => setVoteStep('confirm')} size="lg" className="w-full" disabled={!user}>
                Proceed to Confirm
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
