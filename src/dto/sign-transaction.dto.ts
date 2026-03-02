import { IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionResponseDto } from './transaction-response.dto';

/**
 * DTO for signing a prepared transaction.
 * Client receives a prepared transaction from /transaction/prepare,
 * signs it locally, and sends it back with the signature.
 */
export class SignTransactionDto {
  @ValidateNested()
  @Type(() => TransactionResponseDto)
  @IsNotEmpty()
  transaction: TransactionResponseDto;

  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
