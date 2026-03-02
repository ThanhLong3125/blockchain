import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { AddTransactionDto } from '../dto/add-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { SignTransactionDto } from '../dto/sign-transaction.dto';
import { VerifyTransactionDto } from '../dto/verify-transaction.dto';
import { MineDto } from '../dto/mine.dto';
import { ITransaction } from '../interfaces/transaction.interface';

@Controller('api/blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('wallet/create')
  createWallet() {
    return this.blockchainService.createWallet();
  }

  /**
   * Prepare a transaction for signing.
   * Backend computes: nonce, timestamp, hash.
   * Client then signs this locally and sends it to /transaction to add to mempool.
   */
  @Post('transaction/prepare')
  async prepareTransaction(@Body() dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const prepared = await this.blockchainService.prepareTransaction(dto);
    return {
      from_address: prepared.from_address,
      to_address: prepared.to_address,
      amount: prepared.amount,
      fee: prepared.fee,
      nonce: prepared.nonce!,
      timestamp: prepared.timestamp!,
      hash: prepared.hash!,
    };
  }

  @Post('transaction/sign')
  signTransaction(@Body() body: SignTransactionDto) {
    return this.blockchainService.signTransaction(
      body.transaction,
      body.privateKey,
    );
  }

  @Post('transaction/verify')
  verifyTransaction(@Body() body: VerifyTransactionDto) {
    return {
      isValid: this.blockchainService.verifyTransaction(body.transaction),
    };
  }

  /**
   * Add a signed transaction to the mempool.
   * Expects: transaction with nonce, timestamp, hash (from /transaction/prepare)
   * and signature (from client-side signing).
   */
  @Post('transaction')
  addTransaction(@Body() dto: AddTransactionDto) {
    // Convert DTO to domain model (ITransaction)
    const tx: ITransaction = {
      from_address: dto.from_address,
      to_address: dto.to_address,
      amount: dto.amount,
      nonce: dto.nonce,
      fee: dto.fee,
      timestamp: dto.timestamp,
      hash: dto.hash,
      signature: dto.signature,
    };
    return this.blockchainService.addTransactionToMempool(tx);
  }

  @Get('transactions/pending')
  getPending() {
    return this.blockchainService.getPendingTransactions();
  }

  @Post('mine')
  mine(@Body() body: MineDto) {
    return this.blockchainService.minePendingTransactions(body.minerAddress);
  }

  @Get()
  getBlockchain() {
    return this.blockchainService.getBlockchain();
  }

  @Get('validate')
  validate() {
    return this.blockchainService.validateBlockchain();
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string) {
    return this.blockchainService.getBalance(address);
  }
}
