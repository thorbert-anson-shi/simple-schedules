import { type Shift, type Staff } from '../../db/types';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class StaffAndShift {
  @ApiProperty()
  staff: Staff;

  @ApiProperty()
  shift: Shift;
}

class DateAndShifts {
  @ApiProperty()
  date: Date;

  @ApiProperty({ type: [StaffAndShift] })
  shifts: StaffAndShift[];
}

class GetScheduleDto {
  @ApiProperty({ type: [DateAndShifts] })
  schedule: DateAndShifts[];
}

type GetOneShiftDto = Shift;

class ShiftCreationResponse {
  @ApiProperty()
  shifts_created: number;

  @ApiProperty()
  first_shift: Date;

  @ApiProperty()
  last_shift: Date;
}

class CreateShiftDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  staff_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  end_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  num_weeks: number;
}

class DeleteShiftDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  staff_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  end_date: Date;
}

class BlockOutShiftsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  end_date: Date;
}

export {
  StaffAndShift,
  DateAndShifts,
  GetScheduleDto,
  ShiftCreationResponse,
  CreateShiftDto,
  DeleteShiftDto,
  BlockOutShiftsDto,
  type GetOneShiftDto,
};
