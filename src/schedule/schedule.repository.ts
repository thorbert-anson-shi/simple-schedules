import { Inject, Injectable } from '@nestjs/common';
import { shiftsTable } from '../db/schema';
import { Shift } from '../db/types';
import { CreateOneShiftDto } from './interfaces/schedule.interfaces';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { asc, lte, sql } from 'drizzle-orm';

@Injectable()
export class ScheduleRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async queryShifts(daysAhead: number): Promise<Shift[]> {
    return await this.db
      .select()
      .from(shiftsTable)
      .where(lte(shiftsTable.end_time, sql`NOW() + ${daysAhead}`))
      .orderBy(asc(shiftsTable.staff_id));
  }

  createShift(createOneShiftDto: CreateOneShiftDto): Shift {
    return {} as any;
  }
}
