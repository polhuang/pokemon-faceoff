import { NextResponse } from 'next/server';
import { pokemonData } from '@/data/pokemon';
import { initializeDatabase, getRankedPokemon } from '@/lib/db';
import { Pokemon } from '@/types/pokemon';

export async function GET() {
  try {
    // Get ranked Pokemon from database
    const rankedVoteData = await getRankedPokemon();

    // Create a map for quick lookup
    const voteMap = new Map(rankedVoteData.map(vote => [vote.pokemon_id, vote]));

    // Combine Pokemon data with vote stats - show all Pokemon, even with 0 votes
    const rankedPokemon: Pokemon[] = pokemonData.map(pokemon => {
      const voteData = voteMap.get(pokemon.id);

      return {
        ...pokemon,
        wins: voteData?.wins || 0,
        losses: voteData?.losses || 0,
        totalVotes: voteData?.total_votes || 0
      };
    }).sort((a, b) => {
      // Sort by win rate, then by total votes, then by ID
      const aWinRate = a.totalVotes > 0 ? (a.wins / a.totalVotes) * 100 : 0;
      const bWinRate = b.totalVotes > 0 ? (b.wins / b.totalVotes) * 100 : 0;

      if (aWinRate !== bWinRate) return bWinRate - aWinRate;
      if (a.totalVotes !== b.totalVotes) return b.totalVotes - a.totalVotes;
      return a.id - b.id;
    });

    return NextResponse.json({
      success: true,
      data: rankedPokemon
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch results'
      },
      { status: 500 }
    );
  }
}