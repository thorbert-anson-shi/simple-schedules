import { integer, pgTable } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

const roleEnum = pgEnum('role', ['ADMIN', 'CUSTOMER']);

const staffTable = pgTable('staff', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

const usersTable = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role: roleEnum().notNull(),
    email: varchar({ length: 255 }).notNull(),
    password_hash: varchar({ length: 128 }).notNull(),
  },
  (table) => [uniqueIndex('unique_email').on(sql`lower(${table.email})`)],
);

const shiftsTable = pgTable(
  'shifts',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    staff_id: integer()
      .references(() => staffTable.id)
      .notNull(),
    start_date: timestamp({
      withTimezone: true,
      precision: 0,
    }).notNull(),
    end_date: timestamp({
      withTimezone: true,
      precision: 0,
    }).notNull(),
  },
  // Ensure that end time has to come after start time
  (table) => [
    check('time_check', sql`${table.end_date} > ${table.start_date}`),
  ],
);

export { roleEnum, staffTable, usersTable, shiftsTable };
