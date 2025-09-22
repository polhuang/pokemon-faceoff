export interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string;
  wins: number;
  losses: number;
  totalVotes: number;
}

export interface VoteData {
  pokemonId: number;
  wins: number;
  losses: number;
  totalVotes: number;
}