import { neon } from '@neondatabase/serverless';

// Create a single shared SQL connection instance
export const sql = neon(process.env.DATABASE_URL || '');