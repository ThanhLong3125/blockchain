import { createHash } from 'crypto';
import { TransactionEntity } from 'src/entities/transaction.entity';

export function calculateHash(
  index: number,
  timestamp: number,
  transactions: TransactionEntity[],
  previous_hash: string,
  nonce: number,
): string {
  const txString = transactions.map((tx) => JSON.stringify(tx)).join('|');
  return createHash('sha256')
    .update(
      JSON.stringify({
        index,
        timestamp,
        transactions: txString,
        previous_hash,
        nonce,
      }),
    )
    .digest('hex');
}
