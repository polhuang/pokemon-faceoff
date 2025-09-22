import { Pokemon, VoteData } from '@/types/pokemon';

// Simple in-memory storage for demo purposes
// In a real app, you'd use a database
let voteData: Map<number, VoteData> = new Map();

export function getVoteData(pokemonId: number): VoteData {
  return voteData.get(pokemonId) || {
    pokemonId,
    wins: 0,
    losses: 0,
    totalVotes: 0
  };
}

export function recordVote(winnerId: number, loserId: number): void {
  const winnerData = getVoteData(winnerId);
  const loserData = getVoteData(loserId);
  
  voteData.set(winnerId, {
    ...winnerData,
    wins: winnerData.wins + 1,
    totalVotes: winnerData.totalVotes + 1
  });
  
  voteData.set(loserId, {
    ...loserData,
    losses: loserData.losses + 1,
    totalVotes: loserData.totalVotes + 1
  });
}

export function getAllVoteData(): VoteData[] {
  return Array.from(voteData.values());
}

export function getPokemonWithStats(pokemon: Pokemon): Pokemon {
  const stats = getVoteData(pokemon.id);
  return {
    ...pokemon,
    wins: stats.wins,
    losses: stats.losses,
    totalVotes: stats.totalVotes
  };
}

export function calculateWinRate(pokemon: Pokemon): number {
  if (pokemon.totalVotes === 0) return 0;
  return (pokemon.wins / pokemon.totalVotes) * 100;
}