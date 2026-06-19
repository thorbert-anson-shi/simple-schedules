import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DatabaseModule } from '@src/db/database.module';
import { BookingRepository } from './booking.repository';
import { ScheduleModule } from '@src/schedule/schedule.module';
import { ConfigProvider } from '@src/config';

@Module({
  imports: [DatabaseModule, ScheduleModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, ConfigProvider],
})
export class BookingModule {}
