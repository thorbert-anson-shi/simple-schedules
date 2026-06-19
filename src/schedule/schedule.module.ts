import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleController } from './schedule.controller';
import { DatabaseModule } from '../db/database.module';
import { StaffModule } from '../staff/staff.module';
import { ConfigProvider } from '@src/config';

@Module({
  imports: [DatabaseModule, StaffModule],
  providers: [ScheduleService, ScheduleRepository, ConfigProvider],
  controllers: [ScheduleController],
  exports: [ScheduleService, ScheduleRepository],
})
export class ScheduleModule {}
