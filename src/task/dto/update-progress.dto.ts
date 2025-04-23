import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class UpdateTaskProgressDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  taskId: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  accountId: number;
}
