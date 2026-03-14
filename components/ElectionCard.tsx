import { Calendar, MapPin } from 'lucide-react';
import type { Election } from '@/lib/mockData';

const statusColors = {
  active: 'bg-green-india/10 text-green-india border-green-india/30',
  upcoming: 'bg-saffron/10 text-accent-foreground border-saffron/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

const statusLabels = {
  active: 'Live',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

export default function ElectionCard({ election }: { election: Election }) {
  return (
    <div className="govt-card p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading font-semibold text-foreground">{election.election_type}</h3>
        <span className={`text-xs px-2 py-1 rounded border font-medium ${statusColors[election.status]}`}>
          {statusLabels[election.status]}
        </span>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{election.state}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{election.start_date} — {election.end_date}</span>
        </div>
      </div>
    </div>
  );
}
