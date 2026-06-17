import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { StaffRepository } from '../staff/staff.repository';
import { CreateOneShiftDto } from './interfaces/schedule.interfaces';
import { Shift, Staff } from '../db/types';

const makeShift = (overrides: Partial<Shift> = {}): Shift =>
  ({
    id: 1,
    staff_id: 1,
    start_time: '2020-02-02 17:00:00',
    end_time: '2020-02-03 18:00:00',
    ...overrides,
  }) as Shift;

const makeStaff = (overrides: Partial<Staff> = {}): Staff =>
  ({
    id: 1,
    name: 'Staff Name',
    ...overrides,
  }) as Staff;

describe('ScheduleService', () => {
  let service: ScheduleService;
  let mockScheduleRepository: jest.Mocked<ScheduleRepository>;
  let mockStaffRepository: jest.Mocked<StaffRepository>;

  beforeEach(async () => {
    mockScheduleRepository = {
      queryShifts: jest.fn(),
      createShift: jest.fn(),
    } as any;

    mockStaffRepository = {
      getStaffByIdList: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: ScheduleRepository, useValue: mockScheduleRepository },
        { provide: StaffRepository, useValue: mockStaffRepository },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a schedule grouped by day', async () => {
      const shift1 = makeShift({ id: 1, staff_id: 1 });
      const shift2 = makeShift({ id: 2, staff_id: 2 });
      const shift3 = makeShift({ id: 3, staff_id: 1 });

      mockScheduleRepository.queryShifts.mockResolvedValue([
        shift1,
        shift2,
        shift3,
      ]);
      mockStaffRepository.getStaffByIdList.mockResolvedValue([
        makeStaff({ id: 1, name: 'Alice' }),
        makeStaff({ id: 2, name: 'Bob' }),
      ]);

      const result = await service.fetchSchedule(14);

      expect(result.schedule[0].shifts).toHaveLength(2);
      expect(result.schedule[1].shifts).toHaveLength(1);
      expect(result.schedule[2].shifts).toHaveLength(0);

      expect(mockScheduleRepository.queryShifts).toHaveBeenCalledWith(14);
      expect(mockStaffRepository.getStaffByIdList).toHaveBeenCalledWith([
        1, 2, 1,
      ]);
    });

    it('should return empty schedule when no shifts', async () => {
      mockScheduleRepository.queryShifts.mockResolvedValue([]);
      mockStaffRepository.getStaffByIdList.mockResolvedValue([]);

      const result = await service.fetchSchedule(14);

      result.schedule.forEach((day) => {
        expect(day.shifts).toHaveLength(0);
      });
    });
  });

  describe('createShift', () => {
    it('should delegate to the repository and return the shift', () => {
      const dto = { staff_id: 1 } as CreateOneShiftDto;

      const expected = makeShift();
      mockScheduleRepository.createShift.mockReturnValue(expected);

      const result = service.createShift(dto);

      expect(result).toBe(expected);
      expect(mockScheduleRepository.createShift).toHaveBeenCalledWith(dto);
    });
  });
});
