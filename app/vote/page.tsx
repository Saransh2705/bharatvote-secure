"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CandidateCard from '@/components/CandidateCard';
import { candidates, elections } from '@/lib/mockData';
import Layout from '@/components/Layout';

type VoteStep = 'select' | 'confirm' | 'done';

export default function VotingPage() {
  const [selectedElection, setSelectedElection] = useState<string>('2');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voteStep, setVoteStep] = useState<VoteStep>('select');

  const activeElections = elections.filter(e => e.status === 'active');
  const electionCandidates = candidates.filter(c => c.election_id === selectedElection);
  const chosen = candidates.find(c => c.id === selectedCandidate);

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
                <span className="text-sm font-medium">Vote Confirmation ID: BV-2026-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">Thank you for participating in the democratic process.</p>
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
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setVoteStep('select')} className="flex-1">Go Back</Button>
                <Button onClick={() => setVoteStep('done')} className="flex-1 bg-green-india hover:bg-green-india/90">
                  <Lock className="h-4 w-4 mr-2" /> Confirm & Submit
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

          {/* Election selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {activeElections.map(e => (
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

          {/* Candidates */}
          <div className="space-y-3">
            {electionCandidates.map(c => (
              <CandidateCard
                key={c.id}
                candidate={c}
                selected={selectedCandidate === c.id}
                onSelect={() => setSelectedCandidate(c.id)}
              />
            ))}
          </div>

          {selectedCandidate && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <Button onClick={() => setVoteStep('confirm')} size="lg" className="w-full">
                Proceed to Confirm
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
