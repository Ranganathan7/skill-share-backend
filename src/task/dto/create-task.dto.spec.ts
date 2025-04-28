import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';
import {
  SkillCategory,
  RateCurrency,
  fieldConfig,
} from '../../common/constants/constants';
import { createTask } from './sample-requests';

describe('CreateTaskDto', () => {
  let dto: CreateTaskDto;

  beforeEach(() => {
    dto = plainToInstance(CreateTaskDto, {
      accountId: 1,
      category: SkillCategory.BACKEND,
      name: 'Task Name',
      description: 'Task description goes here.',
      expectedStartDate: createTask.expectedStartDate,
      expectedWorkingHours: 40,
      hourlyRate: 50,
      rateCurrency: RateCurrency.USD,
    });
  });

  describe('accountId', () => {
    it('should fail if accountId is not a positive integer', async () => {
      dto.accountId = -1;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'accountId')).toBe(true);
    });

    it('should pass if accountId is a positive integer', async () => {
      dto.accountId = 10;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('category', () => {
    it('should fail if category is invalid', async () => {
      dto.category = 'INVALID_CATEGORY' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'category')).toBe(true);
    });

    it('should pass if category is a valid SkillCategory', async () => {
      dto.category = SkillCategory.BACKEND;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('name', () => {
    it('should fail if name exceeds max length', async () => {
      dto.name = 'a'.repeat(fieldConfig.taskName.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'name')).toBe(true);
    });

    it('should pass if name is within the max length', async () => {
      dto.name = 'Valid task name';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('description', () => {
    it('should fail if description exceeds max length', async () => {
      dto.description = 'a'.repeat(fieldConfig.taskDescription.length + 1);
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'description')).toBe(true);
    });

    it('should pass if description is within the max length', async () => {
      dto.description = 'Valid task description';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('expectedStartDate', () => {
    it('should fail if expectedStartDate is not a valid date string', async () => {
      dto.expectedStartDate = 'invalid-date' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'expectedStartDate')).toBe(true);
    });

    it('should pass if expectedStartDate is a valid date string', async () => {
      dto.expectedStartDate = '2025-05-01T00:00:00Z';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('expectedWorkingHours', () => {
    it('should fail if expectedWorkingHours is not a positive number', async () => {
      dto.expectedWorkingHours = -5;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'expectedWorkingHours')).toBe(
        true,
      );
    });

    it('should pass if expectedWorkingHours is a positive number', async () => {
      dto.expectedWorkingHours = 40;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('hourlyRate', () => {
    it('should fail if hourlyRate is not a positive number', async () => {
      dto.hourlyRate = -50;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'hourlyRate')).toBe(true);
    });

    it('should pass if hourlyRate is a positive number', async () => {
      dto.hourlyRate = 50;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('rateCurrency', () => {
    it('should fail if rateCurrency is invalid', async () => {
      dto.rateCurrency = 'INVALID_CURRENCY' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'rateCurrency')).toBe(true);
    });

    it('should pass if rateCurrency is a valid RateCurrency', async () => {
      dto.rateCurrency = RateCurrency.USD;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
