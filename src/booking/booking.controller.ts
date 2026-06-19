import { Controller, Get, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Roles } from '@src/auth/auth.decorators';
import { User } from '@src/users/users.decorator';
import { Role } from '@src/db/types';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  @Roles(['CUSTOMER'])
  async getOwnBookings(@User() user: { sub: number; role: Role }) {}

  @Get(':customerId')
  @Roles(['ADMIN'])
  async getCustomerBookings(@Param('customerId') customerId: number) {}

  @Post()
  @Roles(['ADMIN', 'CUSTOMER'])
  async createBooking(@User() user: { sub: number; role: Role }) {}
}
