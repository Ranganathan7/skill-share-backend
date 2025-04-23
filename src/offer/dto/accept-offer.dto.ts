import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AcceptOfferDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  providerId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;
}
