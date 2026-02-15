import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class TransactionDto {
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
}
