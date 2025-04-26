import {
  IsInt,
  IsPositive
} from 'class-validator';

export class GetAccountDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard
}
