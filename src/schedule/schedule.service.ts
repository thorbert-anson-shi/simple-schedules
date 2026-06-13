import { Injectable } from '@nestjs/common';
import {
  GetOneShiftDto,
  GetScheduleDto,
} from './interfaces/schedule.interfaces';

@Injectable()
export class ScheduleService {
  findAll(): GetScheduleDto {
    return {} as GetScheduleDto;
  }

  createShift(): GetOneShiftDto {
    return {} as GetOneShiftDto;
  }
}
