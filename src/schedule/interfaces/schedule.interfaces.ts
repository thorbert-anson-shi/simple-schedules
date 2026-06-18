import { Shift, Staff } from '../../db/types';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

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

class CreateShiftDto {
  @IsNumber()
  @IsNotEmpty()
  staff_id: number;

  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  start_date: Date;

  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  end_date: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  num_weeks: number;
}

export {
  type StaffAndShift,
  type DateAndShifts,
  type GetScheduleDto,
  type GetOneShiftDto,
  CreateShiftDto,
};
