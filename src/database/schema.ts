import {
  pgTable,
  timestamp,
  text,
  uniqueIndex,
  pgEnum,
  uuid,
} from 'drizzle-orm/pg-core';
import { lifecycleColumns } from './helpers';

export const gender = pgEnum('Gender', ['FEMALE', 'MALE']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: text('full_name').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    username: text().unique(),
    email: text().notNull().unique(),
    gender: gender(),
    birthDate: timestamp('birth_date', { precision: 3, mode: 'string' }),
    photo: text(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('users_email_key').using(
      'btree',
      table.email.asc().nullsLast(),
    ),
    uniqueIndex('users_username_key').using(
      'btree',
      table.username.asc().nullsLast(),
    ),
  ],
);
