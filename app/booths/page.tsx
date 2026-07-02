"use client"

import { useState, useEffect } from 'react';
import { Search, MapPin, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

export default function BoothLocator() {
  const [query, setQuery] = useState('');
  const [booths, setBooths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/booths');
        const json = await res.json();
        setBooths(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = query
    ? booths.filter(b =>
        (b.booth_number || '').toLowerCase().includes(query.toLowerCase()) ||
        (b.district || '').toLowerCase().includes(query.toLowerCase()) ||
        (b.constituency || '').toLowerCase().includes(query.toLowerCase())
      )
    : booths;

  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-2">Polling Booth Locator</h1>
          <p className="text-muted-foreground mb-6">Find your nearest polling booth</p>

          <div className="flex gap-2 mb-8 max-w-md">
            <Input
              placeholder="Search by booth number, district, or constituency"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button variant="outline"><Search className="h-4 w-4" /></Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading booths…</p>
              ) : (
                <>
                  {filtered.map(b => (
                    <div key={b.id} className="govt-card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">Booth {b.booth_number}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{b.constituency}</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{b.address}</div>
                        <div className="flex items-center gap-2"><User className="h-4 w-4" />Booth Officer: {b.officer}</div>
                        <div>{b.district}, {b.state}</div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="text-muted-foreground">No booths found.</p>}
                </>
              )}
            </div>

            <div className="govt-card p-4 flex items-center justify-center min-h-[400px] bg-muted">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Map integration available with Mapbox/OpenStreetMap</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
