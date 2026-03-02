import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ITransaction } from 'src/interfaces/transaction.interface';

export type TransactionDocument = HydratedDocument<TransactionEntity>;

@Schema({ timestamps: true })
export class TransactionEntity implements ITransaction {
  @Prop()
  from_address: string;

  @Prop()
  to_address: string;

  @Prop()
  amount: number;

  @Prop()
  signature?: string;

  @Prop()
  nonce?: number;

  @Prop()
  fee?: number;

  @Prop()
  hash?: string;

  @Prop()
  timestamp?: number;

  @Prop()
  tokenId?: string;
}
