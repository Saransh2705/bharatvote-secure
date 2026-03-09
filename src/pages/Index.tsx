import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Vote, UserCheck, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ElectionCard from '@/components/ElectionCard';
import StatCard from '@/components/StatCard';
import { elections, announcements, documents } from '@/lib/mockData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const activeElections = elections.filter((e) => e.status === 'active' || e.status === 'upcoming');

  return (
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
                <Link to="/register">Register as Voter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/verify">Verify & Vote</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="govt-section bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Vote} label="Active Elections" value={elections.filter(e => e.status === 'active').length} />
            <StatCard icon={UserCheck} label="Registered Voters" value="91.2 Cr" />
            <StatCard icon={Shield} label="Votes Secured" value="2.4 Cr" />
            <StatCard icon={FileText} label="Documents Published" value={documents.length} />
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
              <Link to="/elections">View All Elections</Link>
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

      {/* Announcements */}
      <section className="govt-section">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
            <Bell className="h-6 w-6 text-saffron" />
            Commission Announcements
          </h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="govt-card p-4 flex items-start gap-4">
                <div className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">{a.date}</div>
                <div>
                  <h4 className="font-semibold text-sm">{a.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="govt-section bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold mb-6">Election Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="govt-card p-5">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{doc.category}</span>
                <h3 className="font-semibold mt-3 mb-1">{doc.title}</h3>
                <p className="text-xs text-muted-foreground">{doc.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/documents">View All Documents</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
