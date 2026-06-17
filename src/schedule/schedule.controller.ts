import {
  type CreateOneShiftDto,
  type GetOneShiftDto,
  type GetScheduleDto,
} from './interfaces/schedule.interfaces';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Role } from 'src/db/types';
import { User } from 'src/users/users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  async getAll(
    @User() user: { sub: number; role: Role },
  ): Promise<GetScheduleDto> {
    let daysAhead: number;

    switch (user.role) {
      case 'ADMIN':
        daysAhead = 180;
      case 'CUSTOMER':
        daysAhead = 14;
    }

    return await this.scheduleService.fetchSchedule(daysAhead);
  }

  @Post()
  createShift(@Body() createShiftBody: CreateOneShiftDto): GetOneShiftDto {
    return this.scheduleService.createShift(createShiftBody);
  }
}
