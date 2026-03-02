import { BlockchainService } from './blockchain.service';
import { ITransaction } from '../interfaces/transaction.interface';
import { createWallet } from '../utils/wallet.util';
import { signTransaction } from '../utils/sign.util';

// minimal stubbed mongoose model
const makeMockModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('BlockchainService unit tests (no DB)', () => {
  let service: BlockchainService;
  let mockModel: any;

  beforeEach(() => {
    mockModel = makeMockModel();
    service = new BlockchainService(mockModel);
  });

  describe('prepareTransaction', () => {
    it('should set nonce=0 when no prior blocks and empty mempool', async () => {
      mockModel.find.mockResolvedValue([]);
      service['mempool'] = [];
      const result = await service.prepareTransaction({
        from_address: 'A',
        to_address: 'B',
        amount: 10,
      });
      expect(result.nonce).toBe(0);
      expect(result.hash).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should increment nonce based on confirmed and pending txs', async () => {
      // one confirmed tx from A with nonce 0
      mockModel.find.mockResolvedValue([
        { transactions: [{ from_address: 'A', nonce: 0 }] },
      ]);
      service['mempool'] = [
        { from_address: 'A' } as any,
      ];
      const result = await service.prepareTransaction({
        from_address: 'A',
        to_address: 'C',
        amount: 5,
      });
      // confirmed maxNonce=0, pendingCount=1 -> expected = 0+1+1 =2
      expect(result.nonce).toBe(2);
    });
  });

  describe('addTransactionToMempool', () => {
    it('should accept a valid signed transaction', async () => {
      // stub balance to large enough
      service.getBalance = jest.fn().mockResolvedValue(100);
      // no prior blocks, so nonce 0
      mockModel.find.mockResolvedValue([]);
      service['mempool'] = [];

      const wallet = createWallet();
      const tx: ITransaction = {
        from_address: wallet.publicKey,
        to_address: 'X',
        amount: 10,
        fee: 1,
      };
      const prepared = await service.prepareTransaction(tx);
      const signed = signTransaction(prepared, wallet.privateKey);

      const added = await service.addTransactionToMempool(signed);
      expect(added).toEqual(signed);
      expect(service['mempool']).toContain(signed);
    });

    it('should reject when nonce mismatches', async () => {
      service.getBalance = jest.fn().mockResolvedValue(100);
      mockModel.find.mockResolvedValue([]);
      service['mempool'] = [];

      const wallet = createWallet();
      const tx: ITransaction = {
        from_address: wallet.publicKey,
        to_address: 'Y',
        amount: 5,
      };
      const prepared = await service.prepareTransaction(tx);
      prepared.nonce = 5; // tamper
      const signed = signTransaction(prepared, wallet.privateKey);

      await expect(service.addTransactionToMempool(signed)).rejects.toThrow(/Invalid nonce/);
    });

    it('should reject when balance insufficient after pending', async () => {
      service.getBalance = jest.fn().mockResolvedValue(10);
      mockModel.find.mockResolvedValue([]);
      // put pending tx of 9
      service['mempool'] = [{ from_address: 'A', amount: 9, fee: 0 } as any];

      const wallet = createWallet();
      const tx: ITransaction = {
        from_address: wallet.publicKey,
        to_address: 'Z',
        amount: 10,
        fee: 1,
      };
      const prepared = await service.prepareTransaction(tx);
      const signed = signTransaction(prepared, wallet.privateKey);

      await expect(service.addTransactionToMempool(signed)).rejects.toThrow(/Insufficient balance/);
    });
  });

  describe('minePendingTransactions', () => {
    it('should include transaction fees in reward', async () => {
      // stub latest block by overriding helper (avoid sort on mockModel)
      service.getLatestBlock = jest.fn().mockResolvedValue({
        index: 0,
        hash: '00',
        difficulty: 1,
        timestamp: Date.now(),
        version: 1,
      });
      // ensure create returns the block data passed in
      mockModel.create.mockImplementation(async (obj: any) => obj);
      // prepare two txs
      const tx1: ITransaction = { from_address: 'A', to_address: 'B', amount: 1, fee: 2, hash: 'h1', nonce: 0 };
      const tx2: ITransaction = { from_address: 'A', to_address: 'C', amount: 1, fee: 3, hash: 'h2', nonce: 1 };
      service['mempool'] = [tx1, tx2];

      const block = await service.minePendingTransactions('miner');
      // reward = base 100 + fees 5
      expect(block.reward).toBe(105);
      expect(service['mempool']).toEqual([]);
    });
  });
});
