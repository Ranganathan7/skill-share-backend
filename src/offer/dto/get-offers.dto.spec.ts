import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetOffersDto } from './get-offers.dto'; // Adjust the import path if needed

describe('GetOffersDto', () => {
  let dto: GetOffersDto;

  beforeEach(() => {
    dto = plainToInstance(GetOffersDto, {
      accountId: 1, // Valid accountId
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
});
