import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import {
  CreateBookingDto,
  GetOneBookingDto,
} from './interfaces/booking.interfaces';
import { Role, Shift } from '@src/db/types';
import { PostgresError } from '@src/db/utils';
import { ScheduleRepository } from '@src/schedule/schedule.repository';
import { ConfigProvider } from '@src/config';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private scheduleRepository: ScheduleRepository,
    private configProvider: ConfigProvider,
  ) {}

  async fetchBookingsByCustomerId(
    customerId: number,
  ): Promise<GetOneBookingDto[]> {
    try {
      const rawResponse =
        await this.bookingRepository.getBookingsByCustomerId(customerId);

      const shiftIdsToFetch = rawResponse.reduce(
        (acc, curr) => acc.add(curr.shift_id),
        new Set<number>(),
      );

      const relatedShifts = await this.scheduleRepository.getShiftsByShiftIds([
        ...shiftIdsToFetch,
      ]);

      const shiftIdToShiftObj = relatedShifts.reduce(
        (acc, curr) => acc.set(curr.id, curr),
        new Map<number, Shift>(),
      );

      return rawResponse.map((rawBooking) => {
        const relatedShift = shiftIdToShiftObj.get(rawBooking.shift_id);
        if (!relatedShift) {
          return {
            id: rawBooking.id,
            customer_id: rawBooking.customer_id,
            staff_id: -1,
            start_date: new Date(-8.64e15),
            end_date: new Date(-8.64e15),
            status: rawBooking.status,
          } as GetOneBookingDto;
        }

        return {
          id: rawBooking.id,
          customer_id: rawBooking.customer_id,
          staff_id: relatedShift.staff_id,
          start_date: relatedShift.start_date,
          end_date: relatedShift.end_date,
          status: rawBooking.status,
        } as GetOneBookingDto;
      });
    } catch (error) {
      if (error instanceof PostgresError) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createBooking(
    createBookingDto: CreateBookingDto,
    user: { sub: number; role: Role },
  ): Promise<GetOneBookingDto> {
    try {
      const relatedShifts = await this.scheduleRepository.getShiftsByShiftIds([
        createBookingDto.shift_id,
      ]);

      if (relatedShifts.length === 0 || relatedShifts.length > 1) {
        throw new InternalServerErrorException();
      }

      const relatedShift = relatedShifts[0];

      const daysAhead: number =
        user.role === 'ADMIN'
          ? parseInt(this.configProvider.getEnvVar('ADMIN_LOOKAHEAD_DAYS'))
          : parseInt(this.configProvider.getEnvVar('CUSTOMER_LOOKAHEAD_DAYS'));

      const dateUpperBound = new Date();
      dateUpperBound.setDate(dateUpperBound.getDate() + daysAhead);

      if (relatedShift.start_date > dateUpperBound) {
        throw new ForbiddenException();
      }

      const createdBookings =
        await this.bookingRepository.createBooking(createBookingDto);

      if (createdBookings.length === 0 || createdBookings.length > 1) {
        throw new InternalServerErrorException();
      }

      const createdBooking = createdBookings[0];

      return {
        id: createdBooking.id,
        customer_id: createdBooking.customer_id,
        staff_id: relatedShift.staff_id,
        start_date: relatedShift.start_date,
        end_date: relatedShift.end_date,
        status: createdBooking.status,
      } as GetOneBookingDto;
    } catch (error) {
      if (error instanceof PostgresError) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async cancelBooking(
    bookingId: number,
    user: { sub: number; role: Role },
  ): Promise<void> {
    if (user.role === 'CUSTOMER') {
      // make sure that customer owns booking
      const customerBookings = await this.fetchBookingsByCustomerId(user.sub);
      const validBookingIds = customerBookings.reduce(
        (acc, curr) => acc.add(curr.id),
        new Set<number>(),
      );

      if (!validBookingIds.has(bookingId)) {
        throw new ForbiddenException();
      }
    }

    try {
      await this.bookingRepository.cancelBooking(bookingId);
    } catch (error) {
      if (error instanceof PostgresError) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
