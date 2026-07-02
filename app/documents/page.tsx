"use client"

import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/documents');
        const json = await res.json();
        setDocuments(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(documents.map(d => d.category)))];
  const filtered = filter === 'All' ? documents : documents.filter(d => d.category === filter);

  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-2">Election Documents</h1>
          <p className="text-muted-foreground mb-6">Official election documents and notifications</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  filter === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-muted-foreground py-8">Loading documents…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(doc => (
                <div key={doc.id} className="govt-card p-5">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{doc.category}</span>
                  <h3 className="font-semibold mt-3 mb-1">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{doc.date}</p>
                  <Button variant="outline" size="sm" onClick={() => setViewDoc(doc.id)}>
                    <FileText className="h-4 w-4 mr-1" /> View Document
                  </Button>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-muted-foreground">No documents found.</p>}
            </div>
          )}

          {viewDoc && (
            <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">{documents.find(d => d.id === viewDoc)?.title}</h3>
                  <button onClick={() => setViewDoc(null)}><X className="h-5 w-5" /></button>
                </div>
                <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">PDF Document Viewer</p>
                    <p className="text-sm">Document content would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
