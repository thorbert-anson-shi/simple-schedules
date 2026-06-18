import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateShiftDto,
  DateAndShifts,
  GetOneShiftDto,
  GetScheduleDto,
  StaffAndShift,
} from './interfaces/schedule.interfaces';
import { ScheduleRepository } from './schedule.repository';
import { Shift, Staff } from '../db/types';
import { StaffRepository } from '../staff/staff.repository';
import { PostgresError } from '@src/db/utils';

@Injectable()
export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private staffRepository: StaffRepository,
  ) {}

  async fetchSchedule(daysAhead: number): Promise<GetScheduleDto> {
    let shifts: Shift[];
    try {
      shifts = await this.scheduleRepository.queryShifts(daysAhead);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const staffIdsToQuery = shifts.map((shift) => shift.staff_id);

    let staffObjs: Staff[];
    try {
      staffObjs = await this.staffRepository.getStaffByIdList(staffIdsToQuery);
    } catch (error) {
      if (error instanceof PostgresError) {
        throw new InternalServerErrorException();
      } else {
        throw error;
      }
    }

    const staffIdToStaffObj: Map<number, Staff> = staffObjs.reduce(
      (acc, curr) => acc.set(curr.id, curr),
      new Map<number, Staff>(),
    );

    const shiftsByDate = Map.groupBy(shifts, (shift) =>
      new Date(shift.start_date).toDateString(),
    );

    const schedule: GetScheduleDto = { schedule: [] };
    for (const [date, shiftList] of shiftsByDate) {
      const dateAndShifts: DateAndShifts = { date: new Date(date), shifts: [] };
      for (const shift of shiftList) {
        dateAndShifts.shifts.push({
          shift: shift,
          staff: staffIdToStaffObj.get(shift.staff_id),
        } as StaffAndShift);
      }
      schedule.schedule.push(dateAndShifts);
    }

    return schedule;
  }

  async createShift(createShiftDto: CreateShiftDto): Promise<GetOneShiftDto[]> {
    let createdShifts: Shift[];
    try {
      createdShifts = await this.scheduleRepository.createShift(createShiftDto);
    } catch (error) {
      if (error instanceof PostgresError) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }

    return createdShifts;
  }
}
