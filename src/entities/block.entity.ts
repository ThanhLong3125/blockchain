import { Prop, Schema } from '@nestjs/mongoose';
import { TransactionEntity } from './transaction.entity';
import { HydratedDocument } from 'mongoose';

export type BlockDocument = HydratedDocument<BlockEntity>;
@Schema({ timestamps: true })
export class BlockEntity {
  // Block body: danh sách transaction
  @Prop()
  transactions: TransactionEntity[];

  // Block header fields
  @Prop()
  version?: number;

  @Prop()
  reward?: number; // miner reward amount

  @Prop()
  miner: string; // miner address

  @Prop()
  previous_hash: string;

  @Prop()
  hash: string;

  // Merkle root tóm tắt toàn bộ transactions
  @Prop()
  merkle_root: string;

  @Prop()
  nonce: number;

  // Có thể lưu difficulty của block để track điều kiện mine
  @Prop()
  difficulty?: number;

  @Prop()
  index: number;

  @Prop()
  timestamp: number;
}
