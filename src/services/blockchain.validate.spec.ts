import { BlockchainService } from './blockchain.service';
import { ITransaction } from '../interfaces/transaction.interface';
import { createWallet } from '../utils/wallet.util';
import { signTransaction } from '../utils/sign.util';
import { calculateTransactionHash } from '../utils/transaction.util';
import { calculateMerkleRoot } from '../utils/merkle.util';
import { calculateHash } from '../utils/calculate_hash.utils';

const makeMockModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('Blockchain validation tests', () => {
  let service: BlockchainService;
  let mockModel: any;

  beforeEach(() => {
    mockModel = makeMockModel();
    service = new BlockchainService(mockModel);
  });

  it('rejects block when coinbase amount is incorrect', async () => {
    // create wallets and a signed tx
    const sender = createWallet();
    const tx: ITransaction = {
      from_address: sender.publicKey,
      to_address: 'R',
      amount: 10,
      fee: 2,
      nonce: 0,
    } as ITransaction;
    tx.hash = calculateTransactionHash(tx);
    const signed = signTransaction(tx, sender.privateKey);

    // coinbase with incorrect amount (should be miningReward 100 + fee 2 = 102)
    const coinbase: ITransaction = {
      from_address: 'SYSTEM',
      to_address: 'miner1',
      amount: 50, // incorrect
      fee: 0,
      nonce: 0,
    } as ITransaction;
    coinbase.hash = calculateTransactionHash(coinbase);

    const txs = [coinbase, signed];
    const merkle = calculateMerkleRoot(txs as ITransaction[]);

    const header = {
      index: 1,
      timestamp: Date.now(),
      previous_hash: '0',
      merkle_root: merkle,
      nonce: 0,
      version: 1,
      difficulty: 1,
    } as any;
    // simple mining loop to satisfy difficulty (one leading hex zero)
    let hash = '';
    for (let n = 0; n < 100000; n++) {
      header.nonce = n;
      hash = calculateHash(header);
      if (hash.startsWith('0'.repeat(header.difficulty))) break;
    }

    mockModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([
      // genesis
      { index: 0, timestamp: Date.now(), previous_hash: '0', merkle_root: '', nonce: 0, version: 1, difficulty: 1, hash: '0', transactions: [] },
      // block with bad coinbase
      { index: 1, timestamp: header.timestamp, previous_hash: '0', merkle_root: merkle, nonce: 0, version: 1, difficulty: 1, hash, transactions: txs },
    ]) });

    const ok = await service.validateBlockchain();
    expect(ok).toBe(false);
  });

  it('rejects block when a transaction signature is invalid', async () => {
    const sender = createWallet();
    const tx: ITransaction = {
      from_address: sender.publicKey,
      to_address: 'R2',
      amount: 20,
      fee: 1,
      nonce: 0,
    } as ITransaction;
    tx.hash = calculateTransactionHash(tx);
    // create a fake signature by tampering
    tx.signature = '00deadbeef';

    const coinbase: ITransaction = {
      from_address: 'SYSTEM',
      to_address: 'miner2',
      amount: 101, // miningReward 100 + fee 1
      fee: 0,
      nonce: 0,
    } as ITransaction;
    coinbase.hash = calculateTransactionHash(coinbase);

    const txs = [coinbase, tx];
    const merkle = calculateMerkleRoot(txs as ITransaction[]);
    const header = {
      index: 1,
      timestamp: Date.now(),
      previous_hash: '0',
      merkle_root: merkle,
      nonce: 0,
      version: 1,
      difficulty: 1,
    } as any;
    let hash = '';
    for (let n = 0; n < 100000; n++) {
      header.nonce = n;
      hash = calculateHash(header);
      if (hash.startsWith('0'.repeat(header.difficulty))) break;
    }

    mockModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([
      { index: 0, timestamp: Date.now(), previous_hash: '0', merkle_root: '', nonce: 0, version: 1, difficulty: 1, hash: '0', transactions: [] },
      { index: 1, timestamp: header.timestamp, previous_hash: '0', merkle_root: merkle, nonce: 0, version: 1, difficulty: 1, hash, transactions: txs },
    ]) });

    const ok = await service.validateBlockchain();
    expect(ok).toBe(false);
  });

  it('accepts valid chain with proper coinbase and valid signature', async () => {
    const sender = createWallet();
    const tx: ITransaction = {
      from_address: sender.publicKey,
      to_address: 'R3',
      amount: 30,
      fee: 2,
      nonce: 0,
    } as ITransaction;
    tx.hash = calculateTransactionHash(tx);
    const signed = signTransaction(tx, sender.privateKey);

    const coinbase: ITransaction = {
      from_address: 'SYSTEM',
      to_address: 'miner3',
      amount: 102, // 100 + fee 2
      fee: 0,
      nonce: 0,
    } as ITransaction;
    coinbase.hash = calculateTransactionHash(coinbase);

    const txs = [coinbase, signed];
    const merkle = calculateMerkleRoot(txs as ITransaction[]);
    const header = {
      index: 1,
      timestamp: Date.now(),
      previous_hash: '0',
      merkle_root: merkle,
      nonce: 0,
      version: 1,
      difficulty: 1,
    } as any;
    let hash = '';
    for (let n = 0; n < 100000; n++) {
      header.nonce = n;
      hash = calculateHash(header);
      if (hash.startsWith('0'.repeat(header.difficulty))) break;
    }

    mockModel.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([
      { index: 0, timestamp: Date.now(), previous_hash: '0', merkle_root: '', nonce: 0, version: 1, difficulty: 1, hash: '0', transactions: [] },
      { index: 1, timestamp: header.timestamp, previous_hash: '0', merkle_root: merkle, nonce: 0, version: 1, difficulty: 1, hash, transactions: txs },
    ]) });

    const ok = await service.validateBlockchain();
    expect(ok).toBe(true);
  });
});
