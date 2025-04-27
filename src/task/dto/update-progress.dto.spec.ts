import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskProgressDto } from './update-progress.dto';

describe('UpdateTaskProgressDto', () => {
  let dto: UpdateTaskProgressDto;

  beforeEach(() => {
    dto = plainToInstance(UpdateTaskProgressDto, {
      accountId: 1,
      taskId: 1,
      description: 'Progress update description',
    });
  });

  describe('accountId', () => {
    it('should fail if accountId is not a positive integer', async () => {
      dto.accountId = -1;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'accountId')).toBe(true);
    });

    it('should pass if accountId is a positive integer', async () => {
      dto.accountId = 10;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('taskId', () => {
    it('should fail if taskId is not a positive integer', async () => {
      dto.taskId = -1;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'taskId')).toBe(true);
    });

    it('should pass if taskId is a positive integer', async () => {
      dto.taskId = 10;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('description', () => {
    it('should fail if description is not a string', async () => {
      dto.description = 12345 as any;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'description')).toBe(true);
    });

    it('should pass if description is a valid string', async () => {
      dto.description = 'Valid description';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
