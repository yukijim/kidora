import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kidora_db',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isPostgresOnline = false;

export async function testDbConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    isPostgresOnline = true;
    console.log('✅ Connected to PostgreSQL Database at:', res.rows[0].current_time);
    return true;
  } catch (err) {
    isPostgresOnline = false;
    console.warn('⚠️ PostgreSQL connection not available on local host (Operating with High-Performance In-Memory DB Mode):', err.message);
    return false;
  }
}

export function isDbConnected() {
  return isPostgresOnline;
}

export default pool;
