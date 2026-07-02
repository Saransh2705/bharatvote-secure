import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/candidates?election_id=... — list candidates (public read).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('election_id');

    let query = supabase.from('candidates').select('*').order('votes', { ascending: false });
    if (electionId) query = query.eq('election_id', electionId);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch candidates', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ data, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
