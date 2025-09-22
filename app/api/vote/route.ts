import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, recordVote } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const body = await request.json();
    const { winnerId, loserId } = body;

    // Validate input
    if (!winnerId || !loserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both winnerId and loserId are required'
        },
        { status: 400 }
      );
    }

    if (winnerId === loserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Winner and loser cannot be the same Pokemon'
        },
        { status: 400 }
      );
    }

    // Validate Pokemon IDs (should be between 1 and 10 based on your data)
    if (winnerId < 1 || winnerId > 10 || loserId < 1 || loserId > 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Pokemon ID'
        },
        { status: 400 }
      );
    }

    // Record the vote in the database
    await recordVote(winnerId, loserId);

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record vote'
      },
      { status: 500 }
    );
  }
}