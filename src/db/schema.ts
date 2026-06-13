import { integer, pgTable } from 'drizzle-orm/pg-core';
import { timestampRange } from './types';
import { varchar } from 'drizzle-orm/pg-core';

const staffTable = pgTable('staff', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 256 }).notNull(),
});

const customersTable = pgTable('customers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
});

const shiftsTable = pgTable('shifts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  staff_id: integer()
    .references(() => staffTable.id)
    .notNull(),
  time_range: timestampRange().notNull(),
});

export { staffTable, customersTable, shiftsTable };
