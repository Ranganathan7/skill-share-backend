import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
} from 'class-validator';

export class MakeOfferDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;
}
