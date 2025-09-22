import { Pokemon } from '@/types/pokemon';

// API utility functions for client-side use

export async function fetchPokemonData(): Promise<Pokemon[]> {
  try {
    const response = await fetch('/api/pokemon');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch Pokemon data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    throw error;
  }
}

export async function submitVote(winnerId: number, loserId: number): Promise<void> {
  try {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ winnerId, loserId }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to submit vote');
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

export async function fetchRankedResults(): Promise<Pokemon[]> {
  try {
    const response = await fetch('/api/results');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch results');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

export function calculateWinRate(pokemon: Pokemon): number {
  if (pokemon.totalVotes === 0) return 0;
  return (pokemon.wins / pokemon.totalVotes) * 100;
}

export function getRandomPokemonPair(pokemonList: Pokemon[]): [Pokemon, Pokemon] {
  const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}