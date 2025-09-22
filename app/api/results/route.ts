import { NextResponse } from 'next/server';
import { pokemonData } from '@/data/pokemon';
import { initializeDatabase, getRankedPokemon } from '@/lib/db';
import { Pokemon } from '@/types/pokemon';

export async function GET() {
  try {
    // Initialize database if needed
    await initializeDatabase();

    // Get ranked Pokemon from database
    const rankedVoteData = await getRankedPokemon();

    // Create a map for quick lookup
    const voteMap = new Map(rankedVoteData.map(vote => [vote.pokemon_id, vote]));

    // Combine Pokemon data with vote stats and maintain ranking order
    const rankedPokemon: Pokemon[] = rankedVoteData.map(voteData => {
      const pokemon = pokemonData.find(p => p.id === voteData.pokemon_id);
      if (!pokemon) {
        throw new Error(`Pokemon with ID ${voteData.pokemon_id} not found`);
      }

      return {
        ...pokemon,
        wins: voteData.wins,
        losses: voteData.losses,
        totalVotes: voteData.total_votes
      };
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