import { Injectable } from '@nestjs/common';
import {
  CreateOneShiftDto,
  DateAndShifts,
  GetOneShiftDto,
  GetScheduleDto,
  StaffAndShift,
} from './interfaces/schedule.interfaces';
import { ScheduleRepository } from './schedule.repository';
import { Staff } from '../db/types';
import { StaffRepository } from '../staff/staff.repository';

@Injectable()
export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private staffRepository: StaffRepository,
  ) {}

  async fetchSchedule(daysAhead: number): Promise<GetScheduleDto> {
    const shifts = await this.scheduleRepository.queryShifts(daysAhead);

    const staffIdsToQuery = shifts.map((shift) => shift.staff_id);
    const staffObjs =
      await this.staffRepository.getStaffByIdList(staffIdsToQuery);

    const staffIdToStaffObj: Map<number, Staff> = staffObjs.reduce(
      (acc, curr) => acc.set(curr.id, curr),
      new Map<number, Staff>(),
    );

    const shiftsByDate = Map.groupBy(shifts, (shift) =>
      new Date(shift.start_time).toDateString(),
    );

    let schedule: GetScheduleDto = { schedule: [] };
    for (const [date, shiftList] of shiftsByDate) {
      let dateAndShifts: DateAndShifts = { date: new Date(date), shifts: [] };
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

  createShift(createOneShiftDto: CreateOneShiftDto): GetOneShiftDto {
    const createdShift = this.scheduleRepository.createShift(createOneShiftDto);
    return createdShift;
  }
}
