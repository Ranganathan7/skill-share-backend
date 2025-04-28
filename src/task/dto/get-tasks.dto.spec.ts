import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetTasksDto } from './get-tasks.dto';

describe('GetTasksDto', () => {
  let dto: GetTasksDto;

  beforeEach(() => {
    dto = plainToInstance(GetTasksDto, {
      accountId: 1,
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
});
