import { Pokemon } from '@/types/pokemon';

export const pokemonData: Pokemon[] = [
  {
    id: 1,
    name: "Pikachu",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    type: "Electric",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 2,
    name: "Charizard",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    type: "Fire/Flying",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 3,
    name: "Blastoise",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    type: "Water",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 4,
    name: "Venusaur",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    type: "Grass/Poison",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 5,
    name: "Mewtwo",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    type: "Psychic",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 6,
    name: "Mew",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    type: "Psychic",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 7,
    name: "Dragonite",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
    type: "Dragon/Flying",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 8,
    name: "Snorlax",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    type: "Normal",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 9,
    name: "Gengar",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    type: "Ghost/Poison",
    wins: 0,
    losses: 0,
    totalVotes: 0
  },
  {
    id: 10,
    name: "Machamp",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
    type: "Fighting",
    wins: 0,
    losses: 0,
    totalVotes: 0
  }
];

export function getRandomPokemonPair(): [Pokemon, Pokemon] {
  const shuffled = [...pokemonData].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

export function getPokemonById(id: number): Pokemon | undefined {
  return pokemonData.find(pokemon => pokemon.id === id);
}