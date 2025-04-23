import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { NatureOfWork, RateCurrency, SkillCategory } from 'src/common/constants/constants';

export class AddUpdateSkillDto {
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
