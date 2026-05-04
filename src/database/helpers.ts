import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  varchar,
  bigserial,
} from 'drizzle-orm/pg-core';

export const createChangeLogTable = (tableName: string) => {
  return pgTable(tableName, {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    recordId: uuid('record_id').notNull(),
    action: varchar('action').notNull(),
    actionByUserId: varchar('action_by_user_id').notNull(),
    actionByMeta: jsonb('action_by_meta').notNull(),
    oldData: jsonb('old_data'),
    newData: jsonb('new_data'),
    description: text(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
};

export const lifecycleColumns = {
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date', precision: 3 }),
};
