import {
  CreateShiftDto,
  GetScheduleDto,
  ShiftCreationResponse,
} from './interfaces/schedule.interfaces';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Role } from '../db/types';
import { User } from '../users/users.decorator';
import { AuthGuard, RolesGuard } from '../auth/auth.guard';
import { Roles } from '../auth/auth.decorators';

@Controller('schedule')
@UseGuards(AuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  @Roles(['ADMIN', 'CUSTOMER'])
  async getAll(
    @User() user: { sub: number; role: Role },
  ): Promise<GetScheduleDto> {
    const daysAhead: number = user.role === 'ADMIN' ? 180 : 14;
    return await this.scheduleService.fetchSchedule(daysAhead);
  }

  @Post()
  @Roles(['ADMIN'])
  async createShift(
    @Body() createShiftBody: CreateShiftDto,
  ): Promise<ShiftCreationResponse> {
    return await this.scheduleService.createShift(createShiftBody);
  }
}
