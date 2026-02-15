import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockEntity, BlockDocument } from 'src/entities/block.entity';
import {
  TransactionEntity,
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
    try {
      await this.createGenesisBlock();
    } catch (error) {
      console.error('Failed to create genesis block:', error.message);
      throw new InternalServerErrorException('Failed to initialize blockchain');
    }
  }

  // ==============================
  // WALLET
  // ==============================

  createWallet() {
    try {
      return createWallet();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create wallet: ' + error.message,
      );
    }
  }

  signTransaction(transaction: TransactionEntity, privateKey: string) {
    try {
      if (!transaction || !privateKey) {
        throw new Error('Transaction and privateKey are required');
      }
      const signedTransaction = signTransaction(transaction, privateKey);
      return signedTransaction;
    } catch (error) {
      throw new BadRequestException(
        'Failed to sign transaction: ' + error.message,
      );
    }
  }

  verifyTransaction(transaction: TransactionEntity) {
    try {
      if (!transaction) {
        throw new Error('Transaction is required');
      }
      return verifyTransaction(transaction);
    } catch (error) {
      console.error('Transaction verification error:', error.message);
      throw new BadRequestException(
        'Failed to verify transaction: ' + error.message,
      );
    }
  }

  // ==============================
  // GENESIS
  // ==============================

  async createGenesisBlock() {
    try {
      const existing = await this.blockModel.findOne({ index: 0 });
      if (existing) return existing;

      return await this.blockModel.create({
        index: 0,
        timestamp: Date.now(),
        previous_hash: '0',
        nonce: 0,
        hash: 'GENESIS_BLOCK',
        transactions: [],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create genesis block: ' + error.message,
      );
    }
  }

  // ==============================
  // MEMPOOL
  // ==============================

  async addTransactionToMempool(transaction: TransactionEntity) {
    try {
      if (
        !transaction ||
        !transaction.from_address ||
        !transaction.to_address ||
        transaction.amount === undefined
      ) {
        throw new Error('Invalid transaction: missing required fields');
      }

      if (transaction.from_address !== 'SYSTEM') {
        const isValid = verifyTransaction(transaction);
        if (!isValid) {
          throw new Error('Invalid transaction signature');
        }
      }

      this.mempool.push(transaction);
      return transaction;
    } catch (error) {
      throw new BadRequestException(
        'Failed to add transaction to mempool: ' + error.message,
      );
    }
  }

  getPendingTransactions() {
    try {
      return this.mempool;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get pending transactions: ' + error.message,
      );
    }
  }

  private async getLatestBlock(): Promise<BlockDocument> {
    try {
      const block = await this.blockModel.findOne().sort({ index: -1 });
      if (!block) throw new Error('No blocks found');
      return block;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get latest block: ' + error.message,
      );
    }
  }

  async minePendingTransactions(minerAddress: string) {
    try {
      if (!minerAddress) {
        throw new Error('Miner address is required');
      }

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
        miner: minerAddress,
        reward: this.miningReward,
      });

      this.mempool = [];
      return block;
    } catch (error) {
      throw new BadRequestException('Mining failed: ' + error.message);
    }
  }

  // ==============================
  // QUERY
  // ==============================

  async getBlockchain() {
    try {
      return await this.blockModel.find().sort({ index: 1 });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve blockchain: ' + error.message,
      );
    }
  }

  async validateBlockchain() {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to validate blockchain: ' + error.message,
      );
    }
  }

  async getBalance(address: string) {
    try {
      if (!address) {
        throw new Error('Address is required');
      }

      const blocks = await this.blockModel.find();
      let balance = 0;

      for (const block of blocks) {
        for (const tx of block.transactions || []) {
          if (tx.from_address === address && tx.amount) balance -= tx.amount;
          if (tx.to_address === address && tx.amount) balance += tx.amount;
        }
      }

      return balance;
    } catch (error) {
      throw new BadRequestException('Failed to get balance: ' + error.message);
    }
  }
}
