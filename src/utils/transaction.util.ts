import { createHash } from 'crypto';
import { ITransaction } from 'src/interfaces/transaction.interface';

/**
 * Canonical transaction hash using stable string format.
 * Order: from_address|to_address|amount|nonce|timestamp|tokenId
 * This ensures the same transaction always produces the same hash,
 * regardless of field ordering or JSON implementation differences.
 */
export function calculateTransactionHash(tx: ITransaction): string {
  const from = tx.from_address || '';
  const to = tx.to_address || '';
  const amount = tx.amount != null ? String(tx.amount) : '';
  const nonce = tx.nonce != null ? String(tx.nonce) : '';
  const timestamp = tx.timestamp != null ? String(tx.timestamp) : '';
  const tokenId = tx.tokenId || '';

  const data = `${from}|${to}|${amount}|${nonce}|${timestamp}|${tokenId}`;

  return createHash('sha256').update(data).digest('hex');
}
