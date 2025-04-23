import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { swaggerAPIOptions } from 'src/common/swagger/operations';
import { authenticateAccount, createCompanyProviderAccount, createCompanyUserAccount, createIndividualProviderAccount, createIndividualUserAccount } from './dto/sample-requests';
import { AuthAccountDto } from './dto/authenticate-account.dto';
import { AccountEntity } from 'src/entities/account.entity';

@Controller('accounts')
@ApiTags('Account related services')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(swaggerAPIOptions.createAccount)
  @ApiBody({
    type: CreateAccountDto,
    examples: {
      individualUserAccount: {
        value: createIndividualUserAccount
      },
      companyUserAccount: {
        value: createCompanyUserAccount
      },
      individualProviderAccount: {
        value: createIndividualProviderAccount
      },
      companyProviderAccount: {
        value: createCompanyProviderAccount
      }
    }
  })
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(swaggerAPIOptions.authenticateAccount)
  @ApiBody({
    type: AuthAccountDto,
    examples: {
      authenticateAccount: {
        value: authenticateAccount
      }
    }
  })
  async authenticate(@Body() dto: AuthAccountDto): Promise<AccountEntity> {
    return this.accountService.authenticate(dto);
  }
}
