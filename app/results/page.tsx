'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { fetchRankedResults, calculateWinRate } from '@/lib/api';
import Link from 'next/link';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';

export default function ResultsPage() {
  const [rankedPokemon, setRankedPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRankedResults();
  }, []);

  const loadRankedResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await fetchRankedResults();
      setRankedPokemon(results);
    } catch (err) {
      setError('Failed to load results');
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-300" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-300" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white/60 font-bold">#{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'border-yellow-400/50 bg-yellow-500/10';
      case 1:
        return 'border-gray-300/50 bg-gray-500/10';
      case 2:
        return 'border-amber-300/50 bg-amber-500/10';
      default:
        return 'border-white/20 bg-white/10';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 pulse-glow">
          Pokemon Rankings
        </h1>
        <p className="text-xl text-white/80 mb-8 font-medium">
          See which Pokemon are winning the most battles!
        </p>
        
        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Link href="/vote" className="nav-button flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Voting
          </Link>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pokemon-red mx-auto mb-4"></div>
              <p className="text-white/80">Loading results...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadRankedResults}
                className="nav-button mb-4"
              >
                Try Again
              </button>
              <Link href="/vote" className="nav-button">
                Back to Voting
              </Link>
            </div>
          </div>
        ) : rankedPokemon.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 floating-animation" />
              <h2 className="text-2xl font-bold gradient-text mb-2">No Votes Yet!</h2>
              <p className="text-white/80 mb-4">Start voting to see the rankings.</p>
              <Link href="/vote" className="nav-button">
                Start Voting
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {rankedPokemon.map((pokemon, index) => {
              const winRate = calculateWinRate(pokemon);
              const hasVotes = pokemon.totalVotes > 0;
              
              return (
                <div 
                  key={pokemon.id}
                  className={`pokemon-card p-6 ${getRankColor(index)} group hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(index)}
                    </div>
                    
                    {/* Pokemon Image */}
                    <div className="flex-shrink-0 relative">
                      <img 
                        src={pokemon.image} 
                        alt={pokemon.name}
                        className="w-16 h-16 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-pokemon-blue/20 to-pokemon-red/20 rounded-full blur-lg -z-10 group-hover:blur-xl transition-all duration-300"></div>
                    </div>
                    
                    {/* Pokemon Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold gradient-text mb-1">
                        {pokemon.name}
                      </h3>
                      <p className="text-white/80 capitalize mb-2 font-medium">
                        {pokemon.type}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex-shrink-0 text-right">
                      {hasVotes ? (
                        <>
                          <div className="text-2xl font-bold gradient-text mb-1">
                            {winRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-white/80">
                            {pokemon.wins}W - {pokemon.losses}L
                          </div>
                          <div className="text-xs text-white/60">
                            {pokemon.totalVotes} total votes
                          </div>
                        </>
                      ) : (
                        <div className="text-white/60">
                          No votes yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Win Rate Bar */}
                  {hasVotes && (
                    <div className="mt-4">
                      <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-pokemon-blue to-pokemon-red h-3 transition-all duration-500 rounded-full shadow-lg"
                          style={{ width: `${winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}