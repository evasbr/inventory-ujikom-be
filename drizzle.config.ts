import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './src/database/_migrations',
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres:EVA123sabrina@localhost:5432/test_ujikom',
  },
  migrations: {
    table: '__database_migrations',
    schema: 'public',
  },
});
