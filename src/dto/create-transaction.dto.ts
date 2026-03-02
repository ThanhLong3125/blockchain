import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

/**
 * DTO for creating a new transaction.
 * Client provides only the essential transaction details.
 * Backend will compute: nonce, timestamp, hash
 */
export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  from_address: string;

  @IsString()
  @IsNotEmpty()
  to_address: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsOptional()
  fee?: number;
}
