import { sql } from './database';

export interface VoteRecord {
  pokemon_id: number;
  wins: number;
  losses: number;
  total_votes: number;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pokemon_votes (
        pokemon_id INTEGER PRIMARY KEY,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        total_votes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Initialize all Pokemon with 0 votes if they don't exist
    const pokemonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Based on your pokemon data

    for (const id of pokemonIds) {
      await sql`
        INSERT INTO pokemon_votes (pokemon_id, wins, losses, total_votes)
        VALUES (${id}, 0, 0, 0)
        ON CONFLICT (pokemon_id) DO NOTHING
      `;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get vote data for a specific Pokemon
export async function getVoteData(pokemonId: number): Promise<VoteRecord> {
  try {
    const result = await sql`
      SELECT pokemon_id, wins, losses, total_votes
      FROM pokemon_votes
      WHERE pokemon_id = ${pokemonId}
    `;

    if (result.length === 0) {
      // If Pokemon doesn't exist, create it with 0 votes
      await sql`
        INSERT INTO pokemon_votes (pokemon_id, wins, losses, total_votes)
        VALUES (${pokemonId}, 0, 0, 0)
      `;
      return {
        pokemon_id: pokemonId,
        wins: 0,
        losses: 0,
        total_votes: 0
      };
    }

    return result[0] as VoteRecord;
  } catch (error) {
    console.error('Error getting vote data:', error);
    throw error;
  }
}

// Get all vote data
export async function getAllVoteData(): Promise<VoteRecord[]> {
  try {
    const result = await sql`
      SELECT pokemon_id, wins, losses, total_votes
      FROM pokemon_votes
      ORDER BY pokemon_id
    `;

    return result as VoteRecord[];
  } catch (error) {
    console.error('Error getting all vote data:', error);
    throw error;
  }
}

// Record a vote
export async function recordVote(winnerId: number, loserId: number): Promise<void> {
  try {
    // Execute both updates in parallel for better performance
    await Promise.all([
      // Update winner (use UPSERT to handle missing records)
      sql`
        INSERT INTO pokemon_votes (pokemon_id, wins, losses, total_votes, updated_at)
        VALUES (${winnerId}, 1, 0, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (pokemon_id) DO UPDATE SET
          wins = pokemon_votes.wins + 1,
          total_votes = pokemon_votes.total_votes + 1,
          updated_at = CURRENT_TIMESTAMP
      `,
      // Update loser (use UPSERT to handle missing records)
      sql`
        INSERT INTO pokemon_votes (pokemon_id, wins, losses, total_votes, updated_at)
        VALUES (${loserId}, 0, 1, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (pokemon_id) DO UPDATE SET
          losses = pokemon_votes.losses + 1,
          total_votes = pokemon_votes.total_votes + 1,
          updated_at = CURRENT_TIMESTAMP
      `
    ]);

    console.log(`Vote recorded: Pokemon ${winnerId} beat Pokemon ${loserId}`);
  } catch (error) {
    console.error('Error recording vote:', error);
    throw error;
  }
}

// Get ranked Pokemon (for results page)
export async function getRankedPokemon(): Promise<VoteRecord[]> {
  try {
    // Use the exact same query that works in test-db
    const result = await sql`SELECT * FROM pokemon_votes ORDER BY pokemon_id`;


    // Map to VoteRecord format and calculate win rate for sorting
    const mapped = result.map(row => ({
      pokemon_id: row.pokemon_id,
      wins: row.wins,
      losses: row.losses,
      total_votes: row.total_votes
    }));

    // Sort by win rate, then total votes, then ID
    mapped.sort((a, b) => {
      const aWinRate = a.total_votes > 0 ? (a.wins / a.total_votes) * 100 : 0;
      const bWinRate = b.total_votes > 0 ? (b.wins / b.total_votes) * 100 : 0;

      if (aWinRate !== bWinRate) return bWinRate - aWinRate;
      if (a.total_votes !== b.total_votes) return b.total_votes - a.total_votes;
      return a.pokemon_id - b.pokemon_id;
    });

    return mapped;
  } catch (error) {
    console.error('Error getting ranked Pokemon:', error);
    throw error;
  }
}
