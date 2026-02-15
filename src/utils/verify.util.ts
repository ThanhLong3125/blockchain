import { ec as EC } from 'elliptic';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { calculateTransactionHash } from './transaction.util';

const ec = new EC('secp256k1');

export function verifyTransaction(tx: TransactionEntity): boolean {
  // Giao dịch reward từ hệ thống (SYSTEM) không có chữ ký
  if (tx.from_address === 'SYSTEM') {
    return true;
  }
  if (!tx.signature) return false;

  const key = ec.keyFromPublic(tx.from_address, 'hex');
  const txHash = calculateTransactionHash(tx);

  return key.verify(txHash, tx.signature);
}
