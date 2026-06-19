import { ApiProperty } from '@nestjs/swagger';

type BookingStatus = 'BOOKED' | 'CANCELED';

class CreateBookingDto {
  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  shift_id: number;

  @ApiProperty()
  status: BookingStatus;
}

class GetOneBookingDto {
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
