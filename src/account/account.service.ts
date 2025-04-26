import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountType } from 'src/common/constants/constants';
import { comparePasswords, hashPassword } from 'src/common/utils/hash-password';
import { AuthAccountDto } from './dto/authenticate-account.dto';
import { JwtService } from '@nestjs/jwt';
import { GetAccountDto } from './dto/get-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly dataSource: DataSource, private readonly jwtService: JwtService) { }

  /**
   * Creates a new account based on the provided details.
   * Validates the account type and required fields, hashes the password,
   * and saves the account to the database.
   */
  async create(dto: CreateAccountDto) {
    const { password, type, individualAccount, companyAccount, ...baseFields } = dto;

    // Validate presence of individual details for INDIVIDUAL type
    if (type === AccountType.INDIVIDUAL && !individualAccount) {
      throw new HttpException(
        {
          errorCode: 'MissingIndividualAccount',
          description: `Individual account details must be provided when type is ${type}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate presence of company details for COMPANY type
    if (type === AccountType.COMPANY && !companyAccount) {
      throw new HttpException(
        {
          errorCode: 'MissingCompanyAccount',
          description: `Company account details must be provided when type is ${type}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create and prepare the account entity
    const account = new AccountEntity();
    const hashedPassword = await hashPassword(password);
    Object.assign(account, baseFields, {
      password: hashedPassword,
      type,
      individualAccount: type === AccountType.INDIVIDUAL ? individualAccount : null,
      companyAccount: type === AccountType.COMPANY ? companyAccount : null,
    });

    // Save the account
    await this.dataSource.manager.save(AccountEntity, account);
    return {
      message: 'Account created successfully!',
    };
  }

  /**
   * Authenticates an account using email and password.
   * Returns the access token if credentials are valid.
   * Throws HTTP exceptions for invalid email or password.
   */
  async authenticate(dto: AuthAccountDto): Promise<{ accessToken: string, accountId: number, name: string }> {
    const { email, password } = dto;

    // Look up the account by email
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

    // Compare hashed password
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

    // generating JWT token
    const accessToken = this.jwtService.sign({
      accountId: account.id,
      role: account.role,
      type: account.type
    })

    return {
      accessToken,
      accountId: account.id,
      name: (account.companyAccount?.companyName || account.individualAccount?.firstName)?.concat(account.individualAccount?.lastName ?? '') ?? ''
    };
  }

  /**
   * Return account details if account found
   */
  async get(dto: GetAccountDto): Promise<AccountEntity> {
    // Look up the account by id
    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: dto.accountId }
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

    return account;
  }
}
