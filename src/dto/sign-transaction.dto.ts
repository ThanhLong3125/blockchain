import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDto } from './transaction.dto';

export class SignTransactionDto {
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;

  @IsString()
  privateKey: string;
}
