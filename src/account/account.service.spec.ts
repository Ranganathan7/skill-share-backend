import { AccountService } from './account.service';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountRoles, AccountType } from '../common/constants/constants';
import { HttpException } from '@nestjs/common';

// Mock password utilities
jest.mock('../common/utils/hash-password', () => ({
  hashPassword: jest.fn(async (password) => `hashed-${password}`),
  comparePasswords: jest.fn(async (input, hashed) => {
    console.log('mock compare')
    return input === 'validPassword'
  }),
}));

describe('AccountService', () => {
  let service: AccountService;
  let dataSource: DataSource;
  let jwtService: JwtService;

  beforeEach(() => {
    dataSource = {
      manager: {
        save: jest.fn(),
        findOne: jest.fn(),
      },
    } as any;
    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    } as any;
    service = new AccountService(dataSource, jwtService);
  });

  describe('create', () => {
    const baseDto: CreateAccountDto = {
      email: 'test@example.com',
      password: 'password',
      role: AccountRoles.USER,
      type: AccountType.INDIVIDUAL,
      individualAccount: { firstName: 'John', lastName: 'Doe' } as any,
      companyAccount: null as any,
    };

    it('should throw if individualAccount missing for INDIVIDUAL type', async () => {
      const dto = { ...baseDto, individualAccount: null } as any;

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should throw if companyAccount missing for COMPANY type', async () => {
      const dto = { ...baseDto, type: AccountType.COMPANY, companyAccount: null } as any;

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should create an account successfully', async () => {
      await expect(service.create(baseDto)).resolves.toEqual({
        message: 'Account created successfully!',
      });

      expect(dataSource.manager.save).toHaveBeenCalledWith(
        AccountEntity,
        expect.objectContaining({
          email: baseDto.email,
          type: AccountType.INDIVIDUAL,
          password: `hashed-${baseDto.password}`,
          individualAccount: baseDto.individualAccount,
        }),
      );
    });
  });

  describe('authenticate', () => {
    const email = 'test@example.com';
    const validAccount = {
      id: 1,
      email,
      password: 'hashed-validPassword',
      role: 'USER',
      type: AccountType.INDIVIDUAL,
      individualAccount: { firstName: 'John', lastName: 'Doe' },
      companyAccount: null,
    } as unknown as AccountEntity;

    it('should throw if account not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.authenticate({ email, password: 'wrongPassword' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if password is incorrect', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(validAccount);

      await expect(
        service.authenticate({ email, password: 'wrongPassword' }),
      ).rejects.toThrow(HttpException);
    });

    it('should return access token if credentials are valid', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(validAccount);

      const result = await service.authenticate({ email, password: 'validPassword' });

      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        accountId: validAccount.id,
        name: 'John Doe',
        email: validAccount.email,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        accountId: validAccount.id,
        role: validAccount.role,
        type: validAccount.type,
      });
    });
  });

  describe('get', () => {
    it('should throw if account not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.get({ accountId: 1 })).rejects.toThrow(HttpException);
    });

    it('should return account if found', async () => {
      const account = new AccountEntity();
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.get({ accountId: 1 });

      expect(result).toBe(account);
      expect(dataSource.manager.findOne).toHaveBeenCalledWith(AccountEntity, {
        where: { id: 1 },
      });
    });
  });
});
