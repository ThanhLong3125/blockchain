import { createHash } from 'crypto';
import { TransactionEntity } from 'src/entities/transaction.entity';

export function calculateTransactionHash(tx: TransactionEntity): string {
  const amountStr = tx.amount != null ? String(tx.amount) : '';
  const data =
    tx.from_address + tx.to_address + amountStr;

  return createHash('sha256').update(data).digest('hex');
}
