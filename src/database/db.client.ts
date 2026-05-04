import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be defined');
}

const db = drizzle(databaseUrl);

export type DB = typeof db;

export default db;
