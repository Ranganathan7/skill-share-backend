import { IsEmail, IsEnum, IsNotEmpty, IsOptional, ValidateNested, Length, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountRoles, AccountType, fieldConfig } from 'src/common/constants/constants';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  streetNumber: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  streetName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  city: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  state: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  postCode: string;
}

class IndividualAccountDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  mobileNumber: string;

  @ApiProperty({ required: true, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

class CompanyAccountDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  companyName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  representativeFirstName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  representativeLastName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  businessTaxNumber: string;

  @ApiProperty({ required: false, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}

export class CreateAccountDto {
  @IsEmail()
  @ApiProperty({ required: true, type: String })
  email: string;

  @Length(fieldConfig.password.minLength, fieldConfig.password.length)
  @ApiProperty({ required: true, type: String })
  password: string;

  @IsEnum(AccountRoles)
  @ApiProperty({ required: true, enum: AccountRoles })
  role: AccountRoles;

  @IsEnum(AccountType)
  @ApiProperty({ required: true, enum: AccountType })
  type: AccountType;

  @ApiProperty({ required: false, type: String })
  @ValidateNested()
  @Type(() => IndividualAccountDto)
  @IsOptional()
  individualAccount?: IndividualAccountDto;

  @ApiProperty({ required: false, type: CompanyAccountDto })
  @ValidateNested()
  @Type(() => CompanyAccountDto)
  @IsOptional()
  companyAccount?: CompanyAccountDto;
}
