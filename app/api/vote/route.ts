import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendVoteConfirmationEmail } from '@/lib/email';

// POST /api/vote - Cast a vote (server-side, service role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { election_id, candidate_id, voter_id } = body;

    if (!election_id || !candidate_id || !voter_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = createServerSupabaseClient();

    // One vote per voter per election.
    const { data: existingVote } = await admin
      .from('votes')
      .select('id')
      .eq('election_id', election_id)
      .eq('voter_id', voter_id)
      .maybeSingle();

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted in this election' }, { status: 400 });
    }

    const confirmationId = `BV-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const encryptedVote = Buffer.from(
      JSON.stringify({ candidate_id, timestamp: new Date().toISOString() })
    ).toString('base64');

    const { data, error } = await admin
      .from('votes')
      .insert([{ election_id, voter_id, candidate_id, encrypted_vote: encryptedVote, confirmation_id: confirmationId }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to record vote', details: error.message }, { status: 500 });
    }

    // Tally: bump the candidate's running vote count so results reflect it live.
    const { data: cand } = await admin.from('candidates').select('votes').eq('id', candidate_id).single();
    await admin.from('candidates').update({ votes: (cand?.votes ?? 0) + 1 }).eq('id', candidate_id);

    // Best-effort confirmation email.
    try {
      const { data: election } = await admin.from('elections').select('election_type').eq('id', election_id).single();
      const { data: user } = await admin.from('users').select('email, full_name').eq('id', voter_id).single();
      if (user?.email) {
        await sendVoteConfirmationEmail(user.email, {
          name: user.full_name,
          electionName: election?.election_type || 'Election',
          confirmationId,
          votedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });
      }
    } catch { /* email is non-blocking */ }

    return NextResponse.json(
      { success: true, data: { confirmation_id: confirmationId, voted_at: data.voted_at } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/vote?confirmation_id=... - Verify a vote by confirmation ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmationId = searchParams.get('confirmation_id');
    if (!confirmationId) {
      return NextResponse.json({ error: 'Missing confirmation_id parameter' }, { status: 400 });
    }

    const admin = createServerSupabaseClient();
    const { data, error } = await admin
      .from('votes')
      .select('id, confirmation_id, voted_at, election:elections ( election_type, state )')
      .eq('confirmation_id', confirmationId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: { confirmation_id: data.confirmation_id, voted_at: data.voted_at, election: data.election },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
