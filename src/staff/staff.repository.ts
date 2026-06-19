import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { staffTable } from '../db/schema';
import { Staff } from '../db/types';
import { getPostgresError } from '@src/db/utils';

@Injectable()
export class StaffRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async getStaffByIdList(idCollection: Iterable<number>): Promise<Staff[]> {
    let staffList: Staff[];
    try {
      const idArray = [...idCollection];

      staffList = await this.db
        .select()
        .from(staffTable)
        .where(inArray(staffTable.id, idArray));
    } catch (error) {
      throw getPostgresError(error);
    }

    return staffList;
  }
}
