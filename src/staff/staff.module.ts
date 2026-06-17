import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { StaffRepository } from './staff.repository';

@Module({
  imports: [DatabaseModule],
  providers: [StaffRepository],
  exports: [StaffRepository],
})
export class StaffModule {}
