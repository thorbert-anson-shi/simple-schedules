import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class BookingRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async getBookingsByCustomerId(id: number): Promise<void> {}
}
