import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsPositive } from 'class-validator';
import { NatureOfWork, RateCurrency, SkillCategory } from '../../common/constants/constants';

export class AddUpdateSkillDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard

  @ApiProperty({ enum: SkillCategory })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  experience: number;

  @ApiProperty({ enum: NatureOfWork })
  @IsEnum(NatureOfWork)
  natureOfWork: NatureOfWork;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  hourlyRate: number;

  @ApiProperty({ enum: RateCurrency })
  @IsEnum(RateCurrency)
  rateCurrency: RateCurrency;
}
