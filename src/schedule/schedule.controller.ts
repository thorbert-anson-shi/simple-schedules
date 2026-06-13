import {
  type GetOneShiftDto,
  type GetScheduleDto,
} from './interfaces/schedule.interfaces';
import { Controller, Get, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Shift } from 'src/db/types';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getAll(): GetScheduleDto {
    return this.scheduleService.findAll();
  }

  @Post()
  createShift(): GetOneShiftDto {
    return this.scheduleService.createShift();
  }
}
