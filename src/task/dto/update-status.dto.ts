import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  accountId: number;
}
