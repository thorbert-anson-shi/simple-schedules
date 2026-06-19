import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateBookingDto } from './interfaces/booking.interfaces';
import { Booking } from '@src/db/types';
import { getPostgresError } from '@src/db/utils';
import { bookingsTable } from '@src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class BookingRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async getBookingsByCustomerId(id: number): Promise<Booking[]> {
    try {
      return await this.db
        .select()
        .from(bookingsTable)
        .where(eq(bookingsTable.customer_id, id));
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking[]> {
    try {
      return await this.db
        .insert(bookingsTable)
        .values({
          customer_id: createBookingDto.customer_id,
          shift_id: createBookingDto.shift_id,
          status: 'BOOKED',
        })
        .returning();
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async cancelBooking(bookingId: number): Promise<void> {
    try {
      await this.db
        .update(bookingsTable)
        .set({ status: 'CANCELED' })
        .where(eq(bookingsTable.id, bookingId));
    } catch (error) {
      throw getPostgresError(error);
    }
  }
}
