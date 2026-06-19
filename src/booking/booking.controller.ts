import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Roles } from '@src/auth/auth.decorators';
import { User } from '@src/users/users.decorator';
import { Role } from '@src/db/types';
import {
  CreateBookingDto,
  GetOneBookingDto,
} from './interfaces/booking.interfaces';
import { AuthGuard, RolesGuard } from '@src/auth/auth.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  @Roles(['ADMIN', 'CUSTOMER'])
  async getOwnBookings(
    @User() user: { sub: number; role: Role },
    @Query('customerId', new ParseIntPipe({ optional: true })) customerId?: number,
  ): Promise<GetOneBookingDto[]> {
    // Only allow two forms of requests: plain customer or admin with customerId query param
    const targetUserId = user.role === 'CUSTOMER' ? user.sub : customerId;
    if (!targetUserId) {
      throw new BadRequestException();
    }

    if (user.role === 'CUSTOMER' && !!customerId) {
      throw new ForbiddenException();
    }

    return await this.bookingService.fetchBookingsByCustomerId(targetUserId);
  }

  @Post()
  @Roles(['ADMIN', 'CUSTOMER'])
  async createBooking(
    @User() user: { sub: number; role: Role },
    @Query('shiftId', ParseIntPipe) shiftId: number,
    @Query('customerId', new ParseIntPipe({ optional: true })) customerId?: number,
  ): Promise<GetOneBookingDto> {
    // Only allow two forms of requests: plain customer or admin with customerId query param
    const targetUserId = user.role === 'CUSTOMER' ? user.sub : customerId;
    if (!targetUserId) {
      throw new BadRequestException();
    }

    if (user.role === 'CUSTOMER' && !!customerId) {
      throw new ForbiddenException();
    }

    return await this.bookingService.createBooking(
      {
        customer_id: targetUserId,
        shift_id: shiftId,
      } as CreateBookingDto,
      user,
    );
  }

  @Patch('cancel/:bookingId')
  @Roles(['CUSTOMER', 'ADMIN'])
  async cancelOwnBooking(
    @User() user: { sub: number; role: Role },
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<void> {
    await this.bookingService.cancelBooking(bookingId, user);
  }
}
