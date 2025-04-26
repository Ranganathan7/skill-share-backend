import { IsInt, IsPositive } from 'class-validator';

export class GetSkillsDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard
}
