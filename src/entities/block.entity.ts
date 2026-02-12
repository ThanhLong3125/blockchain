import { Prop, Schema } from '@nestjs/mongoose';
import { NftEntity } from './nft.entity';
import { HydratedDocument } from 'mongoose';

export type BlockDocument = HydratedDocument<BlockEntity>;
@Schema({ timestamps: true })
export class BlockEntity {
  @Prop()
  nfts: NftEntity[];

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
