import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetSkillsDto } from './get-skills.dto';

describe('GetSkillsDto', () => {
  let dto: GetSkillsDto;

  beforeEach(() => {
    dto = plainToInstance(GetSkillsDto, {
      accountId: 1,
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
});
