import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log('⏳ Running migration...');

  try {
    await migrate(db, { migrationsFolder: 'src/database/_migrations' });
    console.log('✅ Migration Start!');
  } catch (error) {
    console.error('❌ Migration Failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
