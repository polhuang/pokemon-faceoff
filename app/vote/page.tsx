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

      // Auto-load new pair after a short delay
      setTimeout(() => {
        loadNewPair();
      }, 2000);
    } catch (err) {
      setError('Failed to submit vote');
      setHasVoted(false);
      console.error('Error submitting vote:', err);
    }
  };

  if (loading || !pokemonPair) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pokemon-red mx-auto mb-4"></div>
          <p className="text-white/80">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center glass-card p-8">
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
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="absolute top-[32rem] left-0 right-0 z-20">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-3">
            Pokemon Faceoff
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-4 font-medium">
            Choose your favorite Pokemon!
          </p>
        </div>
      </div>

      {/* Voting Area - Centered */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-5xl mx-auto relative w-full">
        {hasVoted ? (
          <div className="text-center py-12 relative z-30">
            <div className="glass-card p-8 max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-pokemon-yellow mx-auto mb-4 floating-animation" />
              <h2 className="text-2xl font-bold gradient-text mb-2">Vote Recorded!</h2>
              <p className="text-white/80 mb-4">Loading next battle...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pokemon-blue mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
            <div className="relative flex justify-center">
              <PokemonCard 
                pokemon={pokemon1}
                onVote={() => handleVote(pokemon1.id, pokemon2.id)}
              />
            </div>
            
            <div className="flex items-center justify-center md:hidden">
              <div className="glass-card w-14 h-14 flex items-center justify-center rounded-full pulse-glow relative overflow-hidden">
                <span className="text-xl font-bold gradient-text relative z-10">VS</span>
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
        </div>
      </div>

      {/* VS Text for desktop with enhanced styling */}
      <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="glass-card w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-full pulse-glow relative overflow-hidden">
          <span className="text-2xl lg:text-3xl font-bold gradient-text relative z-10">VS</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue/20 to-pokemon-red/20 rounded-full animate-pulse"></div>
        </div>
        {/* Enhanced animated rings around VS */}
        <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 border border-white/10 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-[40rem] left-0 right-0 z-20">
        <div className="flex justify-center">
          <Link href="/results" className="nav-button flex items-center gap-2 text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
            <BarChart3 size={18} className="md:w-5 md:h-5" />
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
}