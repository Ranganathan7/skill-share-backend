import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AcceptOfferDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard

  @ApiProperty()
  @IsInt()
  @IsPositive()
  providerId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;
}
