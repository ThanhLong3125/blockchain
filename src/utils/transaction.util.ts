import { createHash } from 'crypto';
import { TransactionEntity } from 'src/entities/transaction.entity';

export function calculateTransactionHash(tx: TransactionEntity): string {
  const amountStr = tx.amount != null ? String(tx.amount) : '';
  const data = JSON.stringify({
    from_address: tx.from_address,
    to_address: tx.to_address,
    amount: amountStr,
  });

  return createHash('sha256').update(data).digest('hex');
}
