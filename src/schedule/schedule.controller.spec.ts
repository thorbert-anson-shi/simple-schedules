import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import {
  CreateShiftDto,
  type GetOneShiftDto,
  GetScheduleDto,
} from './interfaces/schedule.interfaces';
import { ScheduleService } from './schedule.service';
import { Shift } from '../db/types';

describe('ScheduleController', () => {
  let scheduleController: ScheduleController;
  let validSchedule: GetScheduleDto;
  let validCreatedShift: GetOneShiftDto;
  let mockScheduleService: jest.Mocked<
    Pick<ScheduleService, 'fetchSchedule' | 'createShift'>
  >;

  beforeAll(() => {
    validSchedule = {
      schedule: [
        {
          date: new Date(),
          shifts: [
            {
              staff: { id: 1, name: 'Staff Name' },
              shift: {
                id: 1,
                staff_id: 1,
                start_date: new Date('2020-2-2 17:00:00'),
                end_date: new Date('2020-2-2 19:00:00'),
              },
            },
          ],
        },
      ],
    };

    validCreatedShift = {
      id: 1,
      staff_id: 1,
      start_date: new Date('2020-2-2 17:00:00'),
      end_date: new Date('2020-2-2 21:00:00'),
    };
  });

  beforeEach(async () => {
    mockScheduleService = {
      findAll: jest.fn().mockResolvedValue(validSchedule),
      createShift: jest.fn().mockReturnValue(validCreatedShift),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [{ provide: ScheduleService, useValue: mockScheduleService }],
    }).compile();

    scheduleController = module.get<ScheduleController>(ScheduleController);
  });

  describe('get schedule', () => {
    it('should return a GetScheduleDto', async () => {
      await expect(
        scheduleController.getAll({ sub: 1, role: 'CUSTOMER' }),
      ).resolves.toBe(validSchedule);
    });
  });

  describe('create shift', () => {
    it('should return a Shift', () => {
      expect(scheduleController.createShift({} as CreateShiftDto)).toBe(
        validCreatedShift,
      );
    });
  });
});
