import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockEntity, BlockDocument } from 'src/entities/block.entity';
import {
  TransactionEntity,
  TransactionDocument,
} from 'src/entities/transaction.entity';
import { createWallet } from 'src/utils/wallet.util';
import { verifyTransaction } from 'src/utils/verify.util';
import { signTransaction } from 'src/utils/sign.util';
import { calculateHash } from 'src/utils/calculate_hash.utils';
import { mineBlock } from 'src/utils/mine_block.util';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly difficulty = 2;
  private readonly miningReward = 100;

  private mempool: TransactionEntity[] = [];

  constructor(
    @InjectModel(BlockEntity.name)
    private blockModel: Model<BlockDocument>,
  ) {}

  async onModuleInit() {
    await this.createGenesisBlock();
  }

  // ==============================
  // WALLET
  // ==============================

  createWallet() {
    return createWallet();
  }

  signTransaction(transaction: TransactionEntity, privateKey: string) {
    return signTransaction(transaction, privateKey);
  }

  verifyTransaction(transaction: TransactionEntity) {
    return verifyTransaction(transaction);
  }

  // ==============================
  // GENESIS
  // ==============================

  async createGenesisBlock() {
    const existing = await this.blockModel.findOne({ index: 0 });
    if (existing) return existing;

    return this.blockModel.create({
      index: 0,
      timestamp: Date.now(),
      previous_hash: '0',
      nonce: 0,
      hash: 'GENESIS_BLOCK',
      transactions: [],
    });
  }

  // ==============================
  // MEMPOOL
  // ==============================

  async addTransactionToMempool(transaction: TransactionEntity) {
    if (transaction.from_address !== 'SYSTEM') {
      const isValid = verifyTransaction(transaction);
      if (!isValid) {
        throw new Error('Invalid transaction signature');
      }
    }

    this.mempool.push(transaction);

    return transaction;
  }

  getPendingTransactions() {
    return this.mempool;
  }

  private async getLatestBlock(): Promise<BlockDocument> {
    const block = await this.blockModel.findOne().sort({ index: -1 });
    if (!block) throw new Error('No blocks found');
    return block;
  }

  async minePendingTransactions(minerAddress: string) {
    if (this.mempool.length === 0) {
      throw new Error('No transactions to mine');
    }

    const latestBlock = await this.getLatestBlock();
    const newIndex = latestBlock.index + 1;
    const timestamp = Date.now();

    const rewardTx = {
      from_address: 'SYSTEM',
      to_address: minerAddress,
      amount: this.miningReward,
    };

    const transactionsToInclude = [...this.mempool, rewardTx];
    const { nonce, hash } = mineBlock(this.difficulty, {
      index: newIndex,
      timestamp,
      transactions: transactionsToInclude,
      previousHash: latestBlock.hash,
    });
    const block = await this.blockModel.create({
      index: newIndex,
      timestamp,
      previous_hash: latestBlock.hash,
      hash,
      nonce,
      transactions: transactionsToInclude,
    });

    this.mempool = [];

    return block;
  }

  // ==============================
  // QUERY
  // ==============================

  async getBlockchain() {
    return this.blockModel.find().sort({ index: 1 });
  }

  async validateBlockchain() {
    const blocks = await this.blockModel.find().sort({ index: 1 });

    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];

      if (current.previous_hash !== previous.hash) return false;

      const recalculatedHash = calculateHash(
        current.index,
        current.timestamp,
        current.transactions,
        current.previous_hash,
        current.nonce,
      );

      if (current.hash !== recalculatedHash) return false;
    }

    return true;
  }

  async getBalance(address: string) {
    const blocks = await this.blockModel.find();

    let balance = 0;

    for (const block of blocks) {
      for (const tx of block.transactions || []) {
        if (tx.from_address === address && tx.amount) balance -= tx.amount;
        if (tx.to_address === address && tx.amount) balance += tx.amount;
      }
    }

    return balance;
  }
}
