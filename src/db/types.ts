const dayAsName = new Map<number, string>();
dayAsName.set(0, 'SUNDAY');
dayAsName.set(1, 'MONDAY');
dayAsName.set(2, 'TUESDAY');
dayAsName.set(3, 'WEDNESDAY');
dayAsName.set(4, 'THURSDAY');
dayAsName.set(5, 'FRIDAY');
dayAsName.set(6, 'SATURDAY');

type Role = 'ADMIN' | 'CUSTOMER';

import { shiftsTable, staffTable, usersTable } from './schema';
type Shift = typeof shiftsTable.$inferSelect;
type Staff = typeof staffTable.$inferSelect;
type User = typeof usersTable.$inferSelect;

export { dayAsName, type Role, type Shift, type Staff, type User };
