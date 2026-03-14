import { User } from 'lucide-react';
import type { Candidate } from '@/lib/mockData';

interface Props {
  candidate: Candidate;
  selected?: boolean;
  onSelect?: () => void;
  showVotes?: boolean;
}

export default function CandidateCard({ candidate, selected, onSelect, showVotes }: Props) {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={`govt-card p-4 w-full text-left transition-all ${
        selected ? 'ring-2 ring-primary border-primary' : ''
      } ${onSelect ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'}`}
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
          {candidate.photo ? (
            <img src={candidate.photo} alt={candidate.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <User className="h-7 w-7 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{candidate.name}</p>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </div>
        <span className="text-3xl">{candidate.party_symbol}</span>
      </div>
      {showVotes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground">Votes: <span className="font-semibold text-foreground">{candidate.votes.toLocaleString()}</span></p>
        </div>
      )}
    </button>
  );
}
