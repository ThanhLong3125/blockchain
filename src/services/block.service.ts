import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlockDto } from 'src/dto/create_block.dto';
import { BlockDocument, BlockEntity } from 'src/entities/block.entity';
import { mineBlock } from 'src/utils/mine_block.util';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(BlockEntity.name)
    private readonly blockModel: Model<BlockDocument>,
  ) {}

  async createBlock(blockData: CreateBlockDto): Promise<BlockDocument> {
    const timestamp = Date.now();
    const difficulty = 2; // Example difficulty level
    
    // Verify previous block exists
    await this.findBlockByHash(blockData.previous_hash);
    
    const { nonce, hash } = mineBlock(difficulty, {
      index: blockData.index,
      timestamp,
      nfts: blockData.nfts,
      previousHash: blockData.previous_hash,
    });

    const newBlock = await this.blockModel.create({
      ...blockData,
      nonce,
      hash,
      timestamp,
    });
    return newBlock;
  }

  private async findBlockByHash(hash: string): Promise<BlockDocument> {
    const block = await this.blockModel.findOne({ hash }).exec();
    if (!block) {
      throw new Error('Block not found');
    }
    return block;
  }
}
