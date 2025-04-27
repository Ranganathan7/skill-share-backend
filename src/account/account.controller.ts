import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { swaggerAPIOptions } from 'src/common/swagger/operations';
import {
  authenticateAccount,
  createCompanyProviderAccount,
  createCompanyUserAccount,
  createIndividualProviderAccount,
  createIndividualUserAccount
} from './dto/sample-requests';
import { AuthAccountDto } from './dto/authenticate-account.dto';
import { GetAccountDto } from './dto/get-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { headers } from 'src/common/constants/constants';

@Controller('accounts')
@ApiTags('Account related services')
@ApiHeader({
  name: headers.requestId,
  required: true
})
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  /**
   * Endpoint to create a new account.
   * Can be an individual or company, user or provider.
   * Returns success message if account created successfully
   */
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

  /**
   * Endpoint to authenticate an account using email and password.
   * Returns the access token if authentication is successful.
   */
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
  async authenticate(@Body() dto: AuthAccountDto) {
    return this.accountService.authenticate(dto);
  }

  /**
   * Endpoint to get account details after login
   * Returns the account details
   */
  @Post('get')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(swaggerAPIOptions.getAccount)
  async get(@Body() dto: GetAccountDto) {
    return this.accountService.get(dto);
  }
}
