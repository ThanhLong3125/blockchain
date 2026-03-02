import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockEntity, BlockDocument } from '../entities/block.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { ITransaction } from '../interfaces/transaction.interface';
import { createWallet } from '../utils/wallet.util';
import { verifyTransaction } from '../utils/verify.util';
import { signTransaction } from '../utils/sign.util';
import { calculateHash } from '../utils/calculate_hash.utils';
import { mineBlock } from '../utils/mine_block.util';
import { calculateMerkleRoot } from '../utils/merkle.util';
import { calculateTransactionHash } from '../utils/transaction.util';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly difficulty = 2; // initial/default difficulty
  private readonly targetBlockTimeMs = 10000; // 10s cho demo
  private readonly adjustmentInterval = 5; // điều chỉnh mỗi 5 block
  private readonly miningReward = 100;

  private mempool: ITransaction[] = [];

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

  signTransaction(transaction: ITransaction, privateKey: string) {
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

  verifyTransaction(transaction: ITransaction) {
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

  /**
   * Prepare a transaction for signing.
   * Backend computes: nonce, timestamp, hash.
   * Client then signs this locally and sends it back to addTransactionToMempool.
   */
  async prepareTransaction(dto: {
    from_address: string;
    to_address: string;
    amount: number;
    fee?: number;
  }): Promise<ITransaction> {
    try {
      if (!dto.from_address || !dto.to_address || dto.amount === undefined) {
        throw new Error(
          'Missing required fields: from_address, to_address, amount',
        );
      }

      // Compute confirmed max nonce for sender
      const blocks = await this.blockModel.find();
      let maxConfirmedNonce = -1;
      for (const block of blocks) {
        for (const tx of block.transactions || []) {
          if (
            tx.from_address === dto.from_address &&
            typeof tx.nonce === 'number'
          ) {
            if (tx.nonce > maxConfirmedNonce) maxConfirmedNonce = tx.nonce;
          }
        }
      }

      // Include pending txs in mempool
      const pendingCount = this.mempool.filter(
        (t) => t.from_address === dto.from_address,
      ).length;
      const nonce = maxConfirmedNonce + 1 + pendingCount;

      // Set timestamp
      const timestamp = Date.now();

      // Create transaction object for hashing
      const tx: ITransaction = {
        from_address: dto.from_address,
        to_address: dto.to_address,
        amount: dto.amount,
        fee: dto.fee,
        nonce,
        timestamp,
      };

      // Compute canonical hash
      tx.hash = calculateTransactionHash(tx);

      return tx;
    } catch (error) {
      throw new BadRequestException(
        'Failed to prepare transaction: ' + error.message,
      );
    }
  }

  async addTransactionToMempool(transaction: ITransaction) {
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

      // For account-model: enforce nonce and check pending balance (prevent replay/double-spend)
      if (transaction.from_address !== 'SYSTEM') {
        // compute confirmed max nonce for sender
        const blocks = await this.blockModel.find();
        let maxConfirmedNonce = -1;
        for (const block of blocks) {
          for (const tx of block.transactions || []) {
            if (
              tx.from_address === transaction.from_address &&
              typeof tx.nonce === 'number'
            ) {
              if (tx.nonce > maxConfirmedNonce) maxConfirmedNonce = tx.nonce;
            }
          }
        }

        const pendingCount = this.mempool.filter(
          (t) => t.from_address === transaction.from_address,
        ).length;
        const expectedNonce = maxConfirmedNonce + 1 + pendingCount;

        if (typeof transaction.nonce !== 'number') {
          throw new Error('Missing nonce for account-style transaction');
        }

        if (transaction.nonce !== expectedNonce) {
          throw new Error(
            `Invalid nonce. Expected ${expectedNonce} but got ${transaction.nonce}`,
          );
        }

        // pending outgoing (amount + fee) from mempool for this sender
        const pendingOutgoing = this.mempool
          .filter((t) => t.from_address === transaction.from_address)
          .reduce((s, t) => s + (t.amount || 0) + (t.fee || 0), 0);

        const confirmedBalance = await this.getBalance(
          transaction.from_address,
        );
        const required = (transaction.amount || 0) + (transaction.fee || 0);

        if (confirmedBalance - pendingOutgoing < required) {
          throw new Error(
            'Insufficient balance (considering pending outgoing transactions)',
          );
        }
      }

      // Transaction hash should already be computed during preparation.
      // Signature verification ensures the hash hasn't been tampered with.
      if (!transaction.hash) {
        throw new Error('Transaction hash is missing');
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
    const expectedTime = this.targetBlockTimeMs * this.adjustmentInterval;

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

      // Sum fees from mempool transactions
      const totalFees = this.mempool.reduce((s, tx) => s + (tx.fee || 0), 0);
      const rewardAmount = this.miningReward + totalFees;

      const rewardTx = {
        from_address: 'SYSTEM',
        to_address: minerAddress,
        amount: rewardAmount,
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
        reward: rewardAmount,
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
          const fee = tx.fee || 0;
          if (tx.from_address === address && tx.amount)
            balance -= tx.amount + fee;
          if (tx.to_address === address && tx.amount) balance += tx.amount;
        }
      }

      return balance;
    } catch (error) {
      throw new BadRequestException('Failed to get balance: ' + error.message);
    }
  }
}
