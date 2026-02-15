import { createHash } from 'crypto';
import { TransactionEntity } from 'src/entities/transaction.entity';

export function calculateHash(
  index: number,
  timestamp: number,
  transactions: TransactionEntity[],
  previous_hash: string,
  nonce: number,
): string {
  return createHash('sha256').update(index.toString() + timestamp.toString() + transactions.join(',') + previous_hash + nonce.toString()).digest('hex');
}
