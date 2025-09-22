import { NextResponse } from 'next/server';
import { pokemonData } from '@/data/pokemon';
import { initializeDatabase, getAllVoteData } from '@/lib/db';
import { Pokemon } from '@/types/pokemon';

export async function GET() {
  try {
    // Initialize database if needed
    await initializeDatabase();

    // Get all vote data from database
    const voteData = await getAllVoteData();

    // Create a map for quick lookup
    const voteMap = new Map(voteData.map(vote => [vote.pokemon_id, vote]));

    // Combine Pokemon data with vote stats
    const pokemonWithStats: Pokemon[] = pokemonData.map(pokemon => {
      const stats = voteMap.get(pokemon.id);
      return {
        ...pokemon,
        wins: stats?.wins || 0,
        losses: stats?.losses || 0,
        totalVotes: stats?.total_votes || 0
      };
    });

    return NextResponse.json({
      success: true,
      data: pokemonWithStats
    });
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Pokemon data'
      },
      { status: 500 }
    );
  }
}