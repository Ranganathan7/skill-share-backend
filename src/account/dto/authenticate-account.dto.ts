import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { fieldConfig } from 'src/common/constants/constants';

export class AuthAccountDto {
  @ApiProperty({ required: true, type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @Length(fieldConfig.password.minLength, fieldConfig.password.length)
  password: string;
}
