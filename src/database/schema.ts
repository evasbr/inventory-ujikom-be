import { relations } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  text,
  pgEnum,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// --- ENUMS ---

export const inventoryStatusEnum = pgEnum('inventory_status', [
  'AVAILABLE',
  'BORROWED',
  'BROKEN',
]);

export const loanStatusEnum = pgEnum('loan_status', [
  'PENDING',
  'REJECTED',
  'ONGOING',
  'RETURNED',
  'OVERDUE',
]);

export const roleEnum = pgEnum('role', ['admin', 'user']);

// --- TABLES ---

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: inventoryStatusEnum('status').notNull().default('AVAILABLE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  inventoryId: uuid('inventory_id')
    .references(() => inventory.id)
    .notNull(),
  borrowerName: varchar('borrower_name', { length: 255 }).notNull(),
  loanDate: timestamp('loan_date').defaultNow().notNull(),
  dueDate: timestamp('due_date'),
  returnDate: timestamp('return_date'),
  status: loanStatusEnum('status').notNull().default('PENDING'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- RELATIONS ---

export const inventoryRelations = relations(inventory, ({ many }) => ({
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  inventory: one(inventory, {
    fields: [loans.inventoryId],
    references: [inventory.id],
  }),
}));
