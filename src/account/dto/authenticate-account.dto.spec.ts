import { validate } from 'class-validator';
import { AuthAccountDto } from './authenticate-account.dto';
import { fieldConfig } from '../../common/constants/constants';
import { authenticateAccount } from './sample-requests';
import { plainToInstance } from 'class-transformer';

describe('AuthAccountDto', () => {
  let dto: AuthAccountDto;

  beforeEach(() => {
    dto = plainToInstance(AuthAccountDto, authenticateAccount);
  });

  describe('email', () => {
    it('should pass validation with a valid email', async () => {
      dto.email = 'test@example.com';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if email is empty', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'email' && error.constraints?.isNotEmpty)).toBe(true);
    });

    it('should fail validation if email does not match the regex', async () => {
      dto.email = 'invalid-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'email' && error.constraints?.matches)).toBe(true);
    });

    it('should fail validation if email exceeds the maximum length', async () => {
      dto.email = 'a'.repeat(fieldConfig.email.length + 1);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'email' && error.constraints?.maxLength)).toBe(true);
    });
  });

  describe('password', () => {
    it('should pass validation with a valid password', async () => {
      dto.password = 'StrongPwd123!';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if password is not a string', async () => {
      dto.password = 123 as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password' && error.constraints?.isString)).toBe(true);
    });

    it('should fail validation if password is too short', async () => {
      dto.password = 'short';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password' && error.constraints?.minLength)).toBe(true);
    });

    it('should fail validation if password is too long', async () => {
      dto.password = 'a'.repeat(fieldConfig.password.length + 1);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password' && error.constraints?.maxLength)).toBe(true);
    });

    it('should fail validation if password does not match the regex', async () => {
      dto.password = 'weakpassword'; // Assuming your regex has complexity requirements
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'password' && error.constraints?.matches)).toBe(true);
    });
  });
});