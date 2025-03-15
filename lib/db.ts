import { Pool } from 'pg';

// Environment variables will be used in production to connect to Neon
let connectionString = process.env.DATABASE_URL;

// If not in production, use the local database connection for development
if (!connectionString) {
  connectionString = 'postgresql://user:password@localhost:5432/neondb';
  console.warn('No DATABASE_URL environment variable found. Using default local connection string.');
}

// Best practice is to use a connection pool
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Function to query the database
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// Export the pool for transactions and advanced usage
export { pool };
