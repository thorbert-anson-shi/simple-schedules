import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleController } from './schedule.controller';
import { DatabaseModule } from '../db/database.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [DatabaseModule, StaffModule],
  providers: [ScheduleService, ScheduleRepository],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
