import { Shift, Staff } from 'src/db/types';

enum Day {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

interface GetScheduleDto {
  schedule: {
    day: Day;
    shifts:
      | {
          staff: Staff;
          shift: Shift;
        }[]
      | null;
  }[];
}

type GetOneShiftDto = Shift;

type CreateOneShiftDto = Pick<Shift, 'staff_id' | 'time_range'>;

export {
  Day,
  type GetScheduleDto,
  type GetOneShiftDto,
  type CreateOneShiftDto,
};
