import { ec as EC } from 'elliptic';
import { ITransaction } from 'src/interfaces/transaction.interface';
import { calculateTransactionHash } from './transaction.util';

const ec = new EC('secp256k1');

/**
 * Verify a transaction signature.
 * System transactions (from_address === 'SYSTEM') are always valid.
 */
export function verifyTransaction(tx: ITransaction): boolean {
  // System transactions don't have signatures
  if (tx.from_address === 'SYSTEM') {
    return true;
  }
  if (!tx.signature) return false;

  try {
    const key = ec.keyFromPublic(tx.from_address, 'hex');
    const txHash = calculateTransactionHash(tx);

    return key.verify(txHash, tx.signature);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
