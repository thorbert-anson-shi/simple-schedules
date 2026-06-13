import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import {
  Day,
  GetOneShiftDto,
  GetScheduleDto,
} from './interfaces/schedule.interfaces';
import { ScheduleService } from './schedule.service';
import { Shift } from 'src/db/types';

jest.mock('./schedule.service');

describe('ScheduleController', () => {
  let scheduleController: ScheduleController;
  let validSchedule: GetScheduleDto;
  let validCreatedShift: GetOneShiftDto;

  beforeAll(() => {
    validSchedule = {
      schedule: [
        {
          day: Day.MONDAY,
          shifts: [
            {
              staff: { id: 1, name: 'Staff Name' },
              shift: {
                id: 1,
                staff_id: 1,
                time_range: {
                  start: new Date('2020-2-2 17:00:00'),
                  end: new Date('2020-2-2 19:00:00'),
                },
              },
            },
          ],
        },
      ],
    } as GetScheduleDto;

    validCreatedShift = {
      id: 1,
      staff_id: 1,
      time_range: {
        start: new Date('2020-2-2 17:00:00'),
        end: new Date('2020-2-2 21:00:00'),
      },
    } as Shift;

    // Define mocks
    const mockGetSchedule = jest.fn();
    mockGetSchedule.mockImplementation(() => validSchedule);

    const mockCreateShift = jest.fn();
    mockCreateShift.mockImplementation(() => validCreatedShift);

    jest.mocked(ScheduleService).mockImplementation(() => {
      return {
        createShift: mockCreateShift,
        findAll: mockGetSchedule,
      };
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService],
      controllers: [ScheduleController],
    }).compile();

    scheduleController = module.get<ScheduleController>(ScheduleController);
  });

  describe('get schedule', () => {
    it('should return a GetScheduleDto', () => {
      expect(scheduleController.getAll()).toBe(validSchedule);
    });
  });

  describe('create shift', () => {
    it('should return a Shift', () => {
      expect(scheduleController.createShift()).toBe(validCreatedShift);
    });
  });
});
