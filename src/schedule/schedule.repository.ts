import { Inject, Injectable } from '@nestjs/common';
import { shiftsTable } from '../db/schema';
import { Shift } from '../db/types';
import {
  BlockOutShiftsDto,
  CreateShiftDto,
  DeleteShiftDto,
} from './interfaces/schedule.interfaces';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, eq, gte, lte, sql } from 'drizzle-orm';
import { QueryResult } from 'pg';
import { getPostgresError, PostgresError } from '@src/db/utils';

@Injectable()
export class ScheduleRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async queryShifts(daysAhead: number): Promise<Shift[]> {
    let returnedShifts: Shift[];
    try {
      returnedShifts = await this.db
        .select()
        .from(shiftsTable)
        .where(
          and(
            lte(
              shiftsTable.start_date,
              sql`NOW() + ${daysAhead} * INTERVAL '1 day'`,
            ),
            gte(shiftsTable.start_date, sql`NOW()`),
          ),
        )
        .orderBy(asc(shiftsTable.staff_id));
    } catch (error) {
      throw getPostgresError(error);
    }

    return returnedShifts;
  }

  async createShift({
    staff_id,
    start_date,
    end_date,
    num_weeks,
  }: CreateShiftDto): Promise<Shift[]> {
    const createdShifts: CreateShiftDto[] = [];

    const currentStartDate = new Date(start_date);
    const currentEndDate = new Date(end_date);
    for (let i: number = 0; i < num_weeks; i++) {
      const newShift = {
        staff_id,
        start_date: new Date(currentStartDate),
        end_date: new Date(currentEndDate),
      } as CreateShiftDto;

      createdShifts.push(newShift);

      currentStartDate.setDate(currentStartDate.getDate() + 7);
      currentEndDate.setDate(currentEndDate.getDate() + 7);
    }

    let returnedShifts: Shift[];

    try {
      returnedShifts = await this.db
        .insert(shiftsTable)
        .values(createdShifts)
        .returning();
    } catch (error) {
      throw getPostgresError(error);
    }

    return returnedShifts;
  }

  async deleteShift(deleteShiftsDto: DeleteShiftDto): Promise<number> {
    let result: QueryResult;
    try {
      result = await this.db
        .delete(shiftsTable)
        .where(
          and(
            eq(shiftsTable.staff_id, deleteShiftsDto.staff_id),
            lte(shiftsTable.end_date, deleteShiftsDto.end_date),
            gte(shiftsTable.start_date, deleteShiftsDto.start_date),
          ),
        );
    } catch (error) {
      throw getPostgresError(error);
    }

    return result.rowCount ?? 0;
  }

  async blockOutShifts(blockOutShiftsDto: BlockOutShiftsDto): Promise<number> {
    let result: QueryResult;
    try {
      result = await this.db
        .delete(shiftsTable)
        .where(
          and(
            lte(shiftsTable.end_date, blockOutShiftsDto.end_date),
            gte(shiftsTable.start_date, blockOutShiftsDto.start_date),
          ),
        );
    } catch (error) {
      throw getPostgresError(error);
    }

    return result.rowCount ?? 0;
  }
}
