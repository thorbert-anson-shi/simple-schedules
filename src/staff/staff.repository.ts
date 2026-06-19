import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { staffTable } from '../db/schema';
import { Staff } from '../db/types';
import { DatabaseError } from 'pg';
import { PostgresError } from '@src/db/utils';

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
      const dbError =
        error instanceof DatabaseError
          ? error
          : error?.cause instanceof DatabaseError
            ? error.cause
            : null;
      if (dbError) {
        throw new PostgresError(
          'An error occurred with the node-postgres driver',
          dbError.code,
          { cause: dbError.cause },
        );
      } else {
        throw new InternalServerErrorException();
      }
    }

    return staffList;
  }
}
