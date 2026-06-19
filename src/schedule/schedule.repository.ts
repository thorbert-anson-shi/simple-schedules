import { Inject, Injectable } from '@nestjs/common';
import { shiftsTable } from '../db/schema';
import { Shift } from '../db/types';
import {
  BlockOutShiftsDto,
  CreateShiftDto,
  DeleteShiftDto,
} from './interfaces/schedule.interfaces';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { QueryResult } from 'pg';
import { getPostgresError } from '@src/db/utils';

@Injectable()
export class ScheduleRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async queryShifts(daysAhead: number, daysBehind?: number): Promise<Shift[]> {
    try {
      const lowerBoundSql = daysBehind
        ? sql`NOW() - make_interval(days => ${daysBehind})`
        : sql`NOW()`;

      const upperBoundSql = sql`NOW() + make_interval(days => ${daysAhead})`;

      return await this.db
        .select()
        .from(shiftsTable)
        .where(
          and(
            lte(shiftsTable.start_date, upperBoundSql),
            gte(shiftsTable.start_date, lowerBoundSql),
          ),
        )
        .orderBy(asc(shiftsTable.start_date));
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async getShiftsByShiftIds(shiftIds: number[]): Promise<Shift[]> {
    try {
      return await this.db
        .select()
        .from(shiftsTable)
        .where(inArray(shiftsTable.id, shiftIds));
    } catch (error) {
      throw getPostgresError(error);
    }
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
    let result: { id: number }[];
    try {
      result = await this.db
        .delete(shiftsTable)
        .where(
          and(
            eq(shiftsTable.staff_id, deleteShiftsDto.staff_id),
            lte(shiftsTable.end_date, new Date(deleteShiftsDto.end_date)),
            gte(shiftsTable.start_date, new Date(deleteShiftsDto.start_date)),
          ),
        )
        .returning({ id: shiftsTable.id });
    } catch (error) {
      throw getPostgresError(error);
    }

    return result.length;
  }

  async blockOutShifts(blockOutShiftsDto: BlockOutShiftsDto): Promise<number> {
    let result: { id: number }[];
    try {
      result = await this.db
        .delete(shiftsTable)
        .where(
          and(
            lte(shiftsTable.end_date, new Date(blockOutShiftsDto.end_date)),
            gte(shiftsTable.start_date, new Date(blockOutShiftsDto.start_date)),
          ),
        )
        .returning({ id: shiftsTable.id });
    } catch (error) {
      throw getPostgresError(error);
    }

    return result.length;
  }
}
