import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard

  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;
}
