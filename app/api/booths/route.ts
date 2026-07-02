import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/booths — polling booths (public read)
export async function GET() {
  try {
    const { data, error } = await supabase.from('booths').select('*').order('booth_number');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
