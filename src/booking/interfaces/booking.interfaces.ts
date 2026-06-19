import { ApiProperty } from '@nestjs/swagger';

type BookingStatus = 'BOOKED' | 'CANCELED';

class CreateBookingDto {
  customer_id: number;
  shift_id: number;
}

class GetOneBookingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  staff_id: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  status: BookingStatus;
}

export { type BookingStatus, CreateBookingDto, GetOneBookingDto };
