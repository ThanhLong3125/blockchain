import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';
import { TransactionDto } from '../dto/transaction.dto';
import { SignTransactionDto } from '../dto/sign-transaction.dto';
import { VerifyTransactionDto } from '../dto/verify-transaction.dto';
import { MineDto } from '../dto/mine.dto';

@Controller('api/blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('wallet/create')
  createWallet() {
    return this.blockchainService.createWallet();
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

  @Post('transaction')
  addTransaction(@Body() transaction: TransactionDto) {
    return this.blockchainService.addTransactionToMempool(transaction);
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
