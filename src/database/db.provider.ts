import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DB_PROVIDER = 'DbProvider';

export const InjectDb = () => Inject(DB_PROVIDER);

export const dbProvider = {
  provide: 'DB_CONNECTION',
  useFactory: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    return drizzle(pool, { schema });
  },
};
