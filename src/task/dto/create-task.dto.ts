import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  RateCurrency,
  SkillCategory,
  fieldConfig,
} from 'src/common/constants/constants';
import { createTask } from './sample-requests';

export class CreateTaskDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  accountId: number;

  @ApiProperty({ enum: SkillCategory })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiProperty()
  @IsString()
  @MaxLength(fieldConfig.taskName.length)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(fieldConfig.taskDescription.length)
  description: string;

  @ApiProperty({ example: createTask.expectedStartDate })
  @IsDateString()
  expectedStartDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  expectedWorkingHours: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  hourlyRate: number;

  @ApiProperty({ enum: RateCurrency })
  @IsEnum(RateCurrency)
  rateCurrency: RateCurrency;
}
