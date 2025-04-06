// lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema'; // Optional, if you use typed schema

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/postgres',
});

export const db = drizzle(pool, {
  schema,
  logger: true,
});
