"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Vote, UserCheck, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ElectionCard from '@/components/ElectionCard';
import StatCard from '@/components/StatCard';
import Layout from '@/components/Layout';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const [elections, setElections] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ activeElections: 0, registeredVoters: 0, votesCast: 0, documents: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [er, ar, sr] = await Promise.all([
          fetch('/api/elections'), fetch('/api/announcements'), fetch('/api/stats')]);
        const [ej, aj, sj] = await Promise.all([er.json(), ar.json(), sr.json()]);
        setElections(ej.data || []);
        setAnnouncements(aj.data || []);
        if (sj.data) setStats(sj.data);
      } catch { /* ignore */ }
    })();
  }, []);

  const activeElections = elections.filter((e) => e.status === 'active' || e.status === 'upcoming');

  return (
    <Layout>
      <div>
        {/* Hero */}
        <section className="govt-banner text-primary-foreground">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <motion.div {...fadeUp} className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-4">
                Secure Digital Voting for Every Citizen
              </h1>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                BharatVote is India's official digital election platform. Exercise your democratic right
                securely with facial verification, encrypted voting, and real-time transparency.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-saffron text-accent-foreground hover:bg-saffron/90 font-semibold">
                  <Link href="/register">Register as Voter</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/verify">Verify & Vote</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats — live from the database */}
        <section className="govt-section bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Vote} label="Active Elections" value={stats.activeElections} />
              <StatCard icon={UserCheck} label="Registered Voters" value={stats.registeredVoters} />
              <StatCard icon={Shield} label="Votes Cast" value={stats.votesCast} />
              <StatCard icon={FileText} label="Documents Published" value={stats.documents} />
            </div>
          </div>
        </section>

        {/* Active Elections */}
        <section className="govt-section">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold mb-6">Active & Upcoming Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeElections.map((e) => (
                <ElectionCard key={e.id} election={e} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link href="/elections">View All Elections</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="govt-section bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold mb-6">Election Rules & Regulations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Voting Eligibility', text: 'Every Indian citizen aged 18 years or above on the qualifying date is eligible to register as a voter. Valid EPIC card is mandatory.' },
                { title: 'Election Guidelines', text: 'Model Code of Conduct is enforced from announcement date. Political parties must follow prescribed guidelines.' },
                { title: 'Voting Instructions', text: 'Voters must verify identity through facial recognition before casting their vote. One person, one vote policy is strictly enforced.' },
                { title: 'Government Rules', text: 'Elections are conducted under the Representation of the People Act, 1951 and guided by the Election Commission of India.' },
              ].map((item) => (
                <div key={item.title} className="govt-card p-5">
                  <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements — live from the database */}
        <section className="govt-section">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6 text-saffron" />
              Commission Announcements
            </h2>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="govt-card p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-saffron" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm">{a.title}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{a.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-muted-foreground text-sm">No announcements yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
