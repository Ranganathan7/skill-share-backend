import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MakeOfferDto } from './make-offer.dto'; // Adjust the import path if needed

describe('MakeOfferDto', () => {
  let dto: MakeOfferDto;

  beforeEach(() => {
    dto = plainToInstance(MakeOfferDto, {
      accountId: 1, // Valid accountId
      taskId: 1, // Valid taskId
    });
  });

  describe('accountId', () => {
    it('should pass validation with a valid accountId', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0); // Should pass with no errors
    });

    it('should fail when accountId is not a number', async () => {
      dto.accountId = 'abc' as any; // Invalid accountId (string)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'accountId')).toBe(true);
    });

    it('should fail when accountId is negative', async () => {
      dto.accountId = -1; // Invalid accountId (negative number)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'accountId')).toBe(true);
    });

    it('should fail when accountId is zero', async () => {
      dto.accountId = 0; // Invalid accountId (zero is not positive)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'accountId')).toBe(true);
    });
  });

  describe('taskId', () => {
    it('should pass validation with a valid taskId', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0); // Should pass with no errors
    });

    it('should fail when taskId is not a number', async () => {
      dto.taskId = 'xyz' as any; // Invalid taskId (string)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'taskId')).toBe(true);
    });

    it('should fail when taskId is negative', async () => {
      dto.taskId = -10; // Invalid taskId (negative number)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'taskId')).toBe(true);
    });

    it('should fail when taskId is zero', async () => {
      dto.taskId = 0; // Invalid taskId (zero is not positive)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'taskId')).toBe(true);
    });
  });
});
