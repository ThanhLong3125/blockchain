import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockEntity, BlockDocument } from '../entities/block.entity';
import {
  TransactionEntity,
} from '../entities/transaction.entity';
import { createWallet } from '../utils/wallet.util';
import { verifyTransaction } from '../utils/verify.util';
import { signTransaction } from '../utils/sign.util';
import { calculateHash } from '../utils/calculate_hash.utils';
import { mineBlock } from '../utils/mine_block.util';
import { calculateMerkleRoot } from '../utils/merkle.util';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly difficulty = 2; // initial/default difficulty
  private readonly targetBlockTimeMs = 10000; // 10s cho demo
  private readonly adjustmentInterval = 5; // điều chỉnh mỗi 5 block
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

      const timestamp = Date.now();
      const merkle_root = '';
      const difficulty = this.difficulty;

      const header = {
        index: 0,
        timestamp,
        previous_hash: '0',
        merkle_root,
        nonce: 0,
        version: 1,
        difficulty,
      };

      const hash = calculateHash(header);

      return await this.blockModel.create({
        index: header.index,
        timestamp: header.timestamp,
        previous_hash: header.previous_hash,
        nonce: header.nonce,
        hash,
        transactions: [],
        merkle_root: header.merkle_root,
        version: header.version,
        difficulty: header.difficulty,
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

  /**
   * Tính difficulty mới dựa trên thời gian mine các block gần đây.
   * Chiến lược nhẹ (mild): chỉ tăng/giảm 1 đơn vị khi lệch rất nhiều.
   */
  private async getAdjustedDifficulty(): Promise<number> {
    const latestBlock = await this.getLatestBlock();

    // Chưa đủ block để điều chỉnh hoặc đang ở genesis
    if (
      latestBlock.index === 0 ||
      latestBlock.index < this.adjustmentInterval
    ) {
      return this.difficulty;
    }

    const fromIndex = latestBlock.index - this.adjustmentInterval;
    const fromBlock = await this.blockModel.findOne({ index: fromIndex });
    if (!fromBlock) {
      return latestBlock.difficulty ?? this.difficulty;
    }

    const actualTime = latestBlock.timestamp - fromBlock.timestamp;
    const expectedTime =
      this.targetBlockTimeMs * this.adjustmentInterval;

    let newDifficulty = latestBlock.difficulty ?? this.difficulty;

    // Mild adjustment: chỉ tăng/giảm khi lệch nhiều so với expected
    if (actualTime < expectedTime / 2) {
      newDifficulty += 1;
    } else if (actualTime > expectedTime * 2 && newDifficulty > 1) {
      newDifficulty -= 1;
    }

    return newDifficulty;
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
      const merkleRoot = calculateMerkleRoot(transactionsToInclude);

      const difficulty = await this.getAdjustedDifficulty();

      const { nonce, hash } = mineBlock({
        index: newIndex,
        timestamp,
        previous_hash: latestBlock.hash,
        merkle_root: merkleRoot,
        version: 1,
        difficulty,
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
        merkle_root: merkleRoot,
        version: 1,
        difficulty,
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

        const merkleRoot = calculateMerkleRoot(current.transactions || []);

        if (current.merkle_root !== merkleRoot) return false;

        const header = {
          index: current.index,
          timestamp: current.timestamp,
          previous_hash: current.previous_hash,
          merkle_root: merkleRoot,
          nonce: current.nonce,
          version: current.version ?? 1,
          difficulty: current.difficulty ?? this.difficulty,
        };

        // Truyền defaultDifficulty để đảm bảo tính đúng hash
        const recalculatedHash = calculateHash(header, this.difficulty);

        if (current.hash !== recalculatedHash) return false;

        // Đảm bảo hash đáp ứng độ khó được lưu trong header
        if (
          !header.difficulty ||
          !current.hash.startsWith('0'.repeat(header.difficulty))
        ) {
          return false;
        }
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
