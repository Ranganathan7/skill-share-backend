import {
  IsEnum, IsNotEmpty, IsOptional,
  ValidateNested, MaxLength, MinLength,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccountRoles, AccountType, fieldConfig } from '../../common/constants/constants';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @IsNotEmpty()
  @MaxLength(fieldConfig.streetNumber.length)
  @Matches(fieldConfig.streetNumber.regex)
  @ApiProperty({ required: true, type: String })
  streetNumber: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.streetName.length)
  @Matches(fieldConfig.streetName.regex)
  @ApiProperty({ required: true, type: String })
  streetName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.city.length)
  @Matches(fieldConfig.city.regex)
  @ApiProperty({ required: true, type: String })
  city: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.state.length)
  @Matches(fieldConfig.state.regex)
  @ApiProperty({ required: true, type: String })
  state: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.postCode.length)
  @Matches(fieldConfig.postCode.regex)
  @ApiProperty({ required: true, type: String })
  postCode: string;
}

export class IndividualAccountDto {
  @IsNotEmpty()
  @MaxLength(fieldConfig.name.length)
  @ApiProperty({ required: true, type: String })
  firstName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.name.length)
  @ApiProperty({ required: true, type: String })
  lastName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.mobileNumber.length)
  @Matches(fieldConfig.mobileNumber.regex)
  @ApiProperty({ required: true, type: String })
  mobileNumber: string;

  @ApiProperty({ required: true, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class CompanyAccountDto {
  @IsNotEmpty()
  @MaxLength(fieldConfig.name.length)
  @ApiProperty({ required: true, type: String })
  companyName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.name.length)
  @ApiProperty({ required: true, type: String })
  representativeFirstName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.name.length)
  @ApiProperty({ required: true, type: String })
  representativeLastName: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.phoneNumber.length)
  @Matches(fieldConfig.phoneNumber.regex)
  @ApiProperty({ required: true, type: String })
  phoneNumber: string;

  @IsNotEmpty()
  @MaxLength(fieldConfig.businessTaxNumber.length)
  @Matches(fieldConfig.businessTaxNumber.regex)
  @ApiProperty({ required: true, type: String })
  businessTaxNumber: string;

  @ApiProperty({ required: false, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}

export class CreateAccountDto {
  @IsNotEmpty()
  @MaxLength(fieldConfig.email.length)
  @Matches(fieldConfig.email.regex)
  @ApiProperty({ required: true, type: String })
  email: string;

  @MinLength(fieldConfig.password.minLength)
  @MaxLength(fieldConfig.password.length)
  @Matches(fieldConfig.password.regex)
  @ApiProperty({ required: true, type: String })
  password: string;

  @IsEnum(AccountRoles)
  @ApiProperty({ required: true, enum: AccountRoles })
  role: AccountRoles;

  @IsEnum(AccountType)
  @ApiProperty({ required: true, enum: AccountType })
  type: AccountType;

  @ApiProperty({ required: false, type: IndividualAccountDto })
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
