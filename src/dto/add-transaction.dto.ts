import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

/**
 * DTO for adding a signed transaction to the mempool.
 * This is the complete transaction with signature, ready to be added to mempool.
 * Fields like nonce, timestamp, hash should already be set by backend during preparation.
 */
export class AddTransactionDto {
  @IsString()
  @IsNotEmpty()
  from_address: string;

  @IsString()
  @IsNotEmpty()
  to_address: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsNumber()
  @IsOptional()
  nonce?: number;

  @IsNumber()
  @IsOptional()
  fee?: number;

  @IsNumber()
  @IsOptional()
  timestamp?: number;

  @IsString()
  @IsOptional()
  hash?: string;
}
