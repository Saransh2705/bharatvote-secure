import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/documents — official documents (public read)
export async function GET() {
  try {
    const { data, error } = await supabase.from('documents').select('*').order('date', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
