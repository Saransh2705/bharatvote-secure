import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// POST /api/login — verify a voter by EPIC/voter ID (real DB check).
// Used by the "Verify & Vote" flow to authenticate a registered voter.
export async function POST(request: NextRequest) {
  try {
    const { voter_id } = await request.json();
    if (!voter_id) return NextResponse.json({ error: 'EPIC / voter ID is required' }, { status: 400 });

    const admin = createServerSupabaseClient();
    const { data } = await admin
      .from('users')
      .select('id, full_name, voter_id')
      .eq('voter_id', voter_id)
      .maybeSingle();

    if (!data) return NextResponse.json({ found: false, error: 'No registered voter found for this EPIC' }, { status: 404 });
    return NextResponse.json({ found: true, data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
