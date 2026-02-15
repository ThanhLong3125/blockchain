import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDto } from './transaction.dto';

export class VerifyTransactionDto {
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;
}
