import { sql } from '@vercel/postgres';

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

    if (result.rows.length === 0) {
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

    return result.rows[0] as VoteRecord;
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

    return result.rows as VoteRecord[];
  } catch (error) {
    console.error('Error getting all vote data:', error);
    throw error;
  }
}

// Record a vote
export async function recordVote(winnerId: number, loserId: number): Promise<void> {
  try {
    // Update winner
    await sql`
      UPDATE pokemon_votes
      SET
        wins = wins + 1,
        total_votes = total_votes + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE pokemon_id = ${winnerId}
    `;

    // Update loser
    await sql`
      UPDATE pokemon_votes
      SET
        losses = losses + 1,
        total_votes = total_votes + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE pokemon_id = ${loserId}
    `;

    console.log(`Vote recorded: Pokemon ${winnerId} beat Pokemon ${loserId}`);
  } catch (error) {
    console.error('Error recording vote:', error);
    throw error;
  }
}

// Get ranked Pokemon (for results page)
export async function getRankedPokemon(): Promise<VoteRecord[]> {
  try {
    const result = await sql`
      SELECT pokemon_id, wins, losses, total_votes,
        CASE
          WHEN total_votes = 0 THEN 0
          ELSE (wins::float / total_votes::float) * 100
        END as win_rate
      FROM pokemon_votes
      ORDER BY win_rate DESC, total_votes DESC, pokemon_id ASC
    `;

    return result.rows as VoteRecord[];
  } catch (error) {
    console.error('Error getting ranked Pokemon:', error);
    throw error;
  }
}