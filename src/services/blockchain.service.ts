import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockDocument, BlockEntity } from 'src/entities/block.entity';
import { mineBlock } from 'src/utils/mine_block.util';
import {
  BlockChainDocument,
  BlockChainEntity,
} from 'src/entities/blockchain.entity';

@Injectable()
export class BlockChainService {
  constructor(
    @InjectModel(BlockChainEntity.name)
    private readonly blockChainModel: Model<BlockChainDocument>,
    @InjectModel(BlockEntity.name)
    private readonly blockModel: Model<BlockDocument>,
  ) {}

  async createGenesisBlock(): Promise<BlockDocument> {
    const index = 0;
    const timestamp = Date.now();
    const nfts = [];
    const previousHash = '0';

    // difficulty for mining the genesis block
    const difficulty = 2;

    const { nonce, hash } = mineBlock(difficulty, {
      index,
      timestamp,
      nfts,
      previousHash,
    });

    const newBlock = await this.blockModel.create({
      index,
      nfts,
      previous_hash: previousHash,
      nonce,
      hash,
      timestamp,
    });

    await this.blockChainModel.create({
      chain: [newBlock],
    });

    return newBlock;
  }

  async getBlockchain(): Promise<BlockChainDocument> {
    const blockChain = await this.blockChainModel
      .findOne()
      .populate('chain')
      .exec();
    if (!blockChain) {
      throw new Error('Blockchain not found');
    }
    return blockChain;
  }

  async getLatestBlock(): Promise<BlockDocument> {
    const blockChain = await this.getBlockchain();
    const lastBlock = blockChain.chain[blockChain.chain.length - 1];
    if (!lastBlock) {
      throw new Error('Latest block not found');
    }
    return lastBlock;
  }

  async addBlock(newBlock: BlockDocument): Promise<BlockDocument> {
    const blockChain = await this.getBlockchain();
    const lastBlock = blockChain.chain[blockChain.chain.length - 1];
    
    // Verify new block's previous_hash matches last block's hash
    if (newBlock.previous_hash !== lastBlock.hash) {
      throw new Error('Invalid previous_hash: does not match last block hash');
    }
    
    // Verify new block's index is correct
    if (newBlock.index !== lastBlock.index + 1) {
      throw new Error('Invalid block index: must be sequential');
    }
    
    blockChain.chain.push(newBlock);
    await blockChain.save();
    return newBlock;
  }

  async validateBlockchain(): Promise<boolean> {
    const blockChain = await this.getBlockchain();
    const chain = blockChain.chain;

    // Validate genesis block
    if (chain.length === 0) {
      throw new Error('Blockchain is empty');
    }

    const genesisBlock = chain[0];
    if (genesisBlock.previous_hash !== '0') {
      throw new Error('Invalid genesis block: previous_hash should be 0');
    }

    if (genesisBlock.index !== 0) {
      throw new Error('Invalid genesis block: index should be 0');
    }

    // Validate all subsequent blocks
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      // Check index is sequential
      if (currentBlock.index !== previousBlock.index + 1) {
        throw new Error(`Invalid chain at block ${i}: non-sequential index`);
      }

      // Check previous_hash matches
      if (currentBlock.previous_hash !== previousBlock.hash) {
        throw new Error(`Invalid chain at block ${i}: previous_hash mismatch`);
      }
    }

    return true;
  }
}
