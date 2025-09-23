'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { fetchPokemonData, submitVote, getRandomPokemonPair } from '@/lib/api';
import PokemonCard from '@/components/PokemonCard';
import Link from 'next/link';
import { Trophy, BarChart3 } from 'lucide-react';

export default function VotePage() {
  const [pokemonPair, setPokemonPair] = useState<[Pokemon, Pokemon] | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemonData();
  }, []);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const pokemon = await fetchPokemonData();
      setAllPokemon(pokemon);
      loadNewPair(pokemon);
    } catch (err) {
      setError('Failed to load Pokemon data');
      console.error('Error loading Pokemon data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNewPair = (pokemonList?: Pokemon[]) => {
    const pokemon = pokemonList || allPokemon;
    if (pokemon.length < 2) return;

    const pair = getRandomPokemonPair(pokemon);
    setPokemonPair(pair);
    setHasVoted(false);
  };

  const handleVote = async (winnerId: number, loserId: number) => {
    try {
      setHasVoted(true);
      await submitVote(winnerId, loserId);

      // Auto-load new pair immediately
      loadNewPair();
    } catch (err) {
      setError('Failed to submit vote');
      setHasVoted(false);
      console.error('Error submitting vote:', err);
    }
  };

  if (loading || !pokemonPair) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center glass-card p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pokemon-red mx-auto mb-3"></div>
          <p className="text-white/80">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center glass-card p-6">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadPokemonData}
            className="nav-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const [pokemon1, pokemon2] = pokemonPair;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Pokemon Faceoff
          </h1>
          <p className="text-base md:text-lg text-white/80 font-medium">
            Choose your favorite Pokemon!
          </p>
        </div>

        {/* Voting Area */}
        <div className="relative">
        {hasVoted ? (
          <div className="text-center py-8 relative z-30">
            <div className="glass-card p-6 max-w-sm mx-auto">
              <Trophy className="w-12 h-12 text-pokemon-yellow mx-auto mb-3 floating-animation" />
              <h2 className="text-xl font-bold gradient-text mb-2">Vote Recorded!</h2>
              <p className="text-white/80 text-sm mb-3">Loading next battle...</p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pokemon-blue mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="relative flex justify-center">
              <PokemonCard 
                pokemon={pokemon1}
                onVote={() => handleVote(pokemon1.id, pokemon2.id)}
              />
            </div>
            
            <div className="flex items-center justify-center md:hidden">
              <div className="glass-card w-12 h-12 flex items-center justify-center rounded-full pulse-glow relative overflow-hidden">
                <span className="text-lg font-bold gradient-text relative z-10">VS</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue/20 to-pokemon-red/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <PokemonCard 
                pokemon={pokemon2}
                onVote={() => handleVote(pokemon2.id, pokemon1.id)}
              />
            </div>
          </div>
        )}

          {/* VS Text for desktop with enhanced styling */}
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="glass-card w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full pulse-glow relative overflow-hidden">
              <span className="text-xl lg:text-2xl font-bold gradient-text relative z-10">VS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue/20 to-pokemon-red/20 rounded-full animate-pulse"></div>
            </div>
            {/* Enhanced animated rings around VS */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border border-white/10 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 z-20">
          <div className="flex justify-center">
            <Link href="/results" className="nav-button flex items-center gap-2 text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
              <BarChart3 size={18} className="md:w-5 md:h-5" />
              View Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}