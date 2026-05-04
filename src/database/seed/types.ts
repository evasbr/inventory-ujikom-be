import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DB = NodePgDatabase<Record<string, any>>;
