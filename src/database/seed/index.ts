import * as dotenv from 'dotenv';
dotenv.config();
import { bulkInsert } from './bulkInsert';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import userData from './data/user';

async function runSeeder() {
  try {
    console.log(`[SEEDING] - Start Run Seeder`);
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool, { schema });

    await db.transaction(async (tx) => {
      //   Seed User
      const formattedUser = userData.flatMap((user) => {
        return [
          {
            fullName: user.fullName,
            firstName: user.firstName,
            email: user.email,
          },
        ];
      });

      const insertedUser = await bulkInsert(
        tx,
        schema.users,
        [...formattedUser],
        'Users',
      );
    });
    console.log(`[SUCCESS] - End Run Seeder`);
  } catch (error) {
    console.error(`[ERROR] - Error when running seeder : `, error);
  }
}

runSeeder();
