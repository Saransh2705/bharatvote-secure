import { NextRequest, NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/supabase';

// GET /api/elections?status=... - list elections (public read via anon)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase.from('elections').select('*').order('start_date', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch elections', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ data, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/elections - create election (service role; admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { election_type, state, start_date, end_date, status } = body;

    if (!election_type || !state || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = createServerSupabaseClient();
    const { data, error } = await admin
      .from('elections')
      .insert([{ election_type, state, start_date, end_date, status: status || 'upcoming' }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create election', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
