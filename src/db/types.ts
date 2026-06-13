import { customType } from 'drizzle-orm/pg-core';

type TsRangeData = { start: Date; end: Date };

const timestampRange = customType<{
  data: TsRangeData;
  driverData: string;
}>({
  dataType() {
    return 'tsrange';
  },

  toDriver(value: TsRangeData): string {
    const startDate = value.start.toISOString();
    const endDate = value.end.toISOString();

    const startTimestamp = startDate.replace('T', ' ');
    const endTimestamp = endDate.replace('T', ' ');

    return `[${startTimestamp}, ${endTimestamp}]`;
  },

  fromDriver(value: string): TsRangeData {
    const [startDate, endDate] = value.slice(1, -1).split(',');

    return {
      start: new Date(startDate),
      end: new Date(endDate),
    };
  },
});

import { shiftsTable, staffTable, customersTable } from './schema';
type Shift = typeof shiftsTable.$inferSelect;
type Staff = typeof staffTable.$inferSelect;
type Customer = typeof customersTable.$inferSelect;

export { timestampRange, type Shift, type Staff, type Customer };
