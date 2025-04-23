import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
} from 'class-validator';

export class MakeOfferDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  accountId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;
}
