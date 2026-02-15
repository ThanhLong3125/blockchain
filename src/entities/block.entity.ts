import { Prop, Schema } from '@nestjs/mongoose';
import { TransactionEntity } from './transaction.entity';
import { HydratedDocument } from 'mongoose';

export type BlockDocument = HydratedDocument<BlockEntity>;
@Schema({ timestamps: true })
export class BlockEntity {
  @Prop()
  transactions: TransactionEntity[];

  @Prop()
  reward?: number; // miner reward amount

  @Prop()
  miner: string; // miner address

  @Prop()
  previous_hash: string;

  @Prop()
  hash: string;

  @Prop()
  nonce: number;

  @Prop()
  index: number;

  @Prop()
  timestamp: number;
}
