import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AddUpdateSkillDto } from './add-update-skill.dto';
import { SkillCategory, NatureOfWork, RateCurrency } from '../../common/constants/constants';

describe('AddUpdateSkillDto', () => {
  let dto: AddUpdateSkillDto;

  beforeEach(() => {
    dto = plainToInstance(AddUpdateSkillDto, {
      accountId: 1,
      category: SkillCategory.BACKEND,
      experience: 5,
      natureOfWork: NatureOfWork.ONLINE,
      hourlyRate: 50,
      rateCurrency: RateCurrency.USD,
    });
  });

  describe('accountId', () => {
    it('should fail if accountId is not a positive integer', async () => {
      dto.accountId = -1;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'accountId')).toBe(true);
    });
  });

  describe('category', () => {
    it('should fail if category is invalid', async () => {
      dto.category = 'INVALID_CATEGORY' as any;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'category')).toBe(true);
    });
  });

  describe('experience', () => {
    it('should fail if experience is not a positive number', async () => {
      dto.experience = -1;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'experience')).toBe(true);
    });
  });

  describe('natureOfWork', () => {
    it('should fail if natureOfWork is invalid', async () => {
      dto.natureOfWork = 'INVALID_NATURE' as any;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'natureOfWork')).toBe(true);
    });
  });

  describe('hourlyRate', () => {
    it('should fail if hourlyRate is not a positive number', async () => {
      dto.hourlyRate = -10;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'hourlyRate')).toBe(true);
    });
  });

  describe('rateCurrency', () => {
    it('should fail if rateCurrency is invalid', async () => {
      dto.rateCurrency = 'INVALID_CURRENCY' as any;
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'rateCurrency')).toBe(true);
    });
  });

  it('should pass if all fields are valid', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
