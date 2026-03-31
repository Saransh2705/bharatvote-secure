import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendVoteConfirmationEmail } from '@/lib/email';

// POST /api/vote - Cast a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { election_id, candidate_id, voter_id } = body;

    // Validate required fields
    if (!election_id || !candidate_id || !voter_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has already voted in this election
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('election_id', election_id)
      .eq('voter_id', voter_id)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted in this election' },
        { status: 400 }
      );
    }

    // Generate confirmation ID
    const confirmationId = `BV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Encrypt vote data (simplified - in production use proper encryption)
    const encryptedVote = Buffer.from(JSON.stringify({ 
      candidate_id, 
      timestamp: new Date().toISOString() 
    })).toString('base64');

    // Insert vote
    const { data, error } = await supabase
      .from('votes')
      .insert([{
        election_id,
        voter_id,
        candidate_id,
        encrypted_vote: encryptedVote,
        confirmation_id: confirmationId,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error recording vote:', error);
      return NextResponse.json(
        { error: 'Failed to record vote', details: error.message },
        { status: 500 }
      );
    }

    // Get election and user details for email
    const { data: election } = await supabase
      .from('elections')
      .select('election_type')
      .eq('id', election_id)
      .single();

    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', voter_id)
      .single();

    // Send confirmation email
    if (user?.email) {
      await sendVoteConfirmationEmail(user.email, {
        name: user.full_name,
        electionName: election?.election_type || 'Election',
        confirmationId,
        votedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    return NextResponse.json({ 
      success: true,
      data: {
        confirmation_id: confirmationId,
        voted_at: data.voted_at,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/vote/verify - Verify a vote using confirmation ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmationId = searchParams.get('confirmation_id');

    if (!confirmationId) {
      return NextResponse.json(
        { error: 'Missing confirmation_id parameter' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('votes')
      .select(`
        id,
        confirmation_id,
        voted_at,
        election:elections (
          election_type,
          state
        )
      `)
      .eq('confirmation_id', confirmationId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      verified: true,
      data: {
        confirmation_id: data.confirmation_id,
        voted_at: data.voted_at,
        election: data.election,
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
