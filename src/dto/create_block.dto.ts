import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { TransactionEntity } from 'src/entities/transaction.entity';

export class CreateBlockDto {
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @IsOptional()
  transactions?: TransactionEntity[];

  @IsOptional()
  reward?: number;

  @IsNotEmpty()
  @IsString()
  previous_hash: string;
}
