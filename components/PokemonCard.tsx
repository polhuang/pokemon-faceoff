import { Pokemon } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onVote: () => void;
  showStats?: boolean;
}

export default function PokemonCard({ pokemon, onVote, showStats = false }: PokemonCardProps) {
  const winRate = pokemon.totalVotes > 0 ? (pokemon.wins / pokemon.totalVotes) * 100 : 0;

  return (
    <div className="pokemon-card p-10 md:p-12 text-center max-w-md md:max-w-lg mx-auto group cursor-pointer relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pokemon-blue/5 via-transparent to-pokemon-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Pokemon Image with floating animation */}
      <div className="mb-4 md:mb-6 relative z-10">
        <div className="floating-animation">
          <img 
            src={pokemon.image} 
            alt={pokemon.name}
            className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-3xl"
          />
        </div>
        {/* Enhanced glow effect behind image */}
        <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue/30 to-pokemon-red/30 rounded-full blur-xl -z-10 group-hover:blur-2xl group-hover:scale-110 transition-all duration-300"></div>
        {/* Additional glow ring */}
        <div className="absolute inset-0 border border-white/20 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Pokemon Name with gradient text */}
      <h3 className="text-xl md:text-2xl font-bold gradient-text mb-1 md:mb-2 relative z-10 group-hover:text-white transition-colors duration-300">{pokemon.name}</h3>
      <p className="text-white/70 mb-3 md:mb-4 capitalize font-medium text-sm md:text-base relative z-10 group-hover:text-white/90 transition-colors duration-300">{pokemon.type}</p>
      
      {showStats && (
        <div className="mb-6 space-y-3">
          <div className="flex justify-between text-sm bg-white/10 rounded-lg p-2">
            <span className="text-white/80">Wins:</span>
            <span className="font-semibold text-green-300">{pokemon.wins}</span>
          </div>
          <div className="flex justify-between text-sm bg-white/10 rounded-lg p-2">
            <span className="text-white/80">Losses:</span>
            <span className="font-semibold text-red-300">{pokemon.losses}</span>
          </div>
          <div className="flex justify-between text-sm bg-white/10 rounded-lg p-2">
            <span className="text-white/80">Win Rate:</span>
            <span className="font-semibold text-blue-300">{winRate.toFixed(1)}%</span>
          </div>
        </div>
      )}
      
      {/* Vote Button with enhanced styling */}
      <button 
        onClick={onVote}
        className="vote-button w-full relative overflow-hidden text-sm md:text-base px-4 py-2 md:px-8 md:py-4 group-hover:shadow-glow-lg transition-all duration-300"
      >
        <span className="relative z-10 font-semibold">Vote for {pokemon.name}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>
    </div>
  );
}