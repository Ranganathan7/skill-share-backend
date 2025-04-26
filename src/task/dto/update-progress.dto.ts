import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class UpdateTaskProgressDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;

  @ApiProperty()
  @IsString()
  description: string;
}
