import { IsInt, IsPositive } from 'class-validator';

export class GetOffersDto {
  @IsInt()
  @IsPositive()
  accountId: number; // Filled from auth guard
}
