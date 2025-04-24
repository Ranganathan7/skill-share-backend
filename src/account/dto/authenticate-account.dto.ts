import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty
} from 'class-validator';
import { fieldConfig } from 'src/common/constants/constants';

export class AuthAccountDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @Matches(fieldConfig.email.regex)
  @MaxLength(fieldConfig.email.length)
  email: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @MinLength(fieldConfig.password.minLength)
  @MaxLength(fieldConfig.password.length)
  @Matches(fieldConfig.password.regex)
  password: string;
}
