import { Inject, Injectable } from '@nestjs/common';
import { inArray, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { staffTable } from '../db/schema';
import { Staff } from '../db/types';

@Injectable()
export class StaffRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async getStaffByIdList(idList: number[]): Promise<Staff[]> {
    const staffList = await this.db
      .select()
      .from(staffTable)
      .where(inArray(staffTable, idList));

    return staffList;
  }
}
