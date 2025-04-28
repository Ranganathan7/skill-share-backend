import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AcceptOfferDto } from './accept-offer.dto';

describe('AcceptOfferDto', () => {
  let dto: AcceptOfferDto;

  beforeEach(() => {
    dto = plainToInstance(AcceptOfferDto, {
      accountId: 1,
      providerId: 2,
      taskId: 3,
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

  describe('providerId', () => {
    it('should pass validation with a valid providerId', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0); // Should pass with no errors
    });

    it('should fail when providerId is not a number', async () => {
      dto.providerId = 'abc' as any; // Invalid providerId (string)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'providerId')).toBe(true);
    });

    it('should fail when providerId is negative', async () => {
      dto.providerId = -2; // Invalid providerId (negative number)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'providerId')).toBe(true);
    });

    it('should fail when providerId is zero', async () => {
      dto.providerId = 0; // Invalid providerId (zero is not positive)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'providerId')).toBe(true);
    });
  });

  describe('taskId', () => {
    it('should pass validation with a valid taskId', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0); // Should pass with no errors
    });

    it('should fail when taskId is not a number', async () => {
      dto.taskId = 'abc' as any; // Invalid taskId (string)
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'taskId')).toBe(true);
    });

    it('should fail when taskId is negative', async () => {
      dto.taskId = -3; // Invalid taskId (negative number)
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
