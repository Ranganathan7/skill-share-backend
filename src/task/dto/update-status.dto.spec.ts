import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskStatusDto } from './update-status.dto';

describe('UpdateTaskStatusDto', () => {
  let dto: UpdateTaskStatusDto;

  beforeEach(() => {
    dto = plainToInstance(UpdateTaskStatusDto, {
      accountId: 1,
      taskId: 1,
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
});
