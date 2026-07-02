import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// POST /api/register — create (or return existing) voter record.
// Uses the service-role client so it can write regardless of RLS.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, voter_id, state, face_data } = body;

    if (!full_name || !voter_id) {
      return NextResponse.json({ error: 'Full name and EPIC/voter ID are required' }, { status: 400 });
    }

    const admin = createServerSupabaseClient();
    const email: string = body.email || `${String(voter_id).toLowerCase()}@voters.bharatvote.in`;

    // If this EPIC already registered, return it (idempotent onboarding).
    const { data: existing } = await admin
      .from('users')
      .select('id, full_name, voter_id')
      .eq('voter_id', voter_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, data: existing, existed: true });
    }

    const { data, error } = await admin
      .from('users')
      .insert([{ full_name, voter_id, email, state, face_data, aadhaar_verified: true }])
      .select('id, full_name, voter_id')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to register', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
