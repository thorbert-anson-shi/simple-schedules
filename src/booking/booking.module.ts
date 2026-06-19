import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DatabaseModule } from '@src/db/database.module';
import { BookingRepository } from './booking.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
