"use client"

import { useState } from 'react';
import { elections } from '@/lib/mockData';
import ElectionCard from '@/components/ElectionCard';
import Layout from '@/components/Layout';

const filters = ['all', 'active', 'upcoming', 'completed'] as const;

export default function ElectionsPage() {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? elections : elections.filter(e => e.status === filter);

  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-2">Elections</h1>
          <p className="text-muted-foreground mb-6">Browse all elections across India</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm rounded border transition-colors capitalize ${
                  filter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(e => <ElectionCard key={e.id} election={e} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No elections found for this filter.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
