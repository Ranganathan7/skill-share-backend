import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountType } from 'src/common/constants/constants';
import { comparePasswords, hashPassword } from 'src/common/utils/hash-password';
import { AuthAccountDto } from './dto/authenticate-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly dataSource: DataSource) { }

  async create(dto: CreateAccountDto) {
    const { password, type, individualAccount, companyAccount, ...baseFields } = dto;

    if (type === AccountType.INDIVIDUAL && !individualAccount) {
      throw new HttpException(
        {
          errorCode: 'MissingIndividualAccount',
          description: `Individual account details must be provided when type is ${type}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (type === AccountType.COMPANY && !companyAccount) {
      throw new HttpException(
        {
          errorCode: 'MissingCompanyAccount',
          description: `Company account details must be provided when type is ${type}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = new AccountEntity();
    const hashedPassword = await hashPassword(password)
    Object.assign(account, baseFields, {
      password: hashedPassword,
      type,
      individualAccount: type === AccountType.INDIVIDUAL ? individualAccount : null,
      companyAccount: type === AccountType.COMPANY ? companyAccount : null,
    });

    await this.dataSource.manager.save(AccountEntity, account);
    return {
      message: 'Account created successfully!'
    }
  }

  async authenticate(dto: AuthAccountDto): Promise<AccountEntity> {
    const { email, password } = dto;

    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { email },
    });

    if (!account) {
      throw new HttpException(
        {
          errorCode: 'AccountNotFound',
          description: 'No account found with the provided email',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await comparePasswords(password, account.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          errorCode: 'InvalidPassword',
          description: 'Password is incorrect',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return account;
  }
}
