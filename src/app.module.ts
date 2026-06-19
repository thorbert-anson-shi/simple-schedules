import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { StaffModule } from './staff/staff.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [ScheduleModule, StaffModule, AuthModule, UsersModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
