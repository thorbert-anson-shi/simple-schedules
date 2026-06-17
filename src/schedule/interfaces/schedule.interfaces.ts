import { Shift, Staff } from '../../db/types';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

interface StaffAndShift {
  staff: Staff;
  shift: Shift;
}

interface DateAndShifts {
  date: Date;
  shifts: StaffAndShift[];
}

interface GetScheduleDto {
  schedule: DateAndShifts[];
}

type GetOneShiftDto = Shift;

class CreateOneShiftDto {
  @IsNumber()
  @IsNotEmpty()
  staff_id: number;

  @IsNotEmpty()
  @IsDate()
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  end_date: Date;
}

export {
  type StaffAndShift,
  type DateAndShifts,
  type GetScheduleDto,
  type GetOneShiftDto,
  CreateOneShiftDto,
};
