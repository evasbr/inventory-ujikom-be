import { Table, InferInsertModel } from 'drizzle-orm';
import { DB } from './types';

export async function bulkInsert<TTable extends Table>(
  db: DB,
  table: TTable,
  data: InferInsertModel<TTable>[],
  label: string,
) {
  console.log(`[SEEDING] ${label}: ${data.length} rows...`);
  try {
    const result = await db
      .insert(table)
      .values(data)
      .onConflictDoNothing()
      .returning();
    console.log(`[SUCCESS] ${label} seeded.`);
    return result;
  } catch (error) {
    console.error(`[ERROR] ${label} failed:`, error);
    throw error;
  }
}
