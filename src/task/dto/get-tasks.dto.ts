import { IsInt, IsPositive } from 'class-validator';

export class GetTasksDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard
}
