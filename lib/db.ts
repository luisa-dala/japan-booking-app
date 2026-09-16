import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pool?: Pool };

const pool =
  globalForPg.pool ??
  new Pool({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'japan_booking',
  });

if (!globalForPg.pool) globalForPg.pool = pool;

export async function query(text: string, params: unknown[]) {
  return pool.query(text, params as never[]);
}
