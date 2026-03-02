import { ec as EC } from 'elliptic';
import { ITransaction } from 'src/interfaces/transaction.interface';
import { calculateTransactionHash } from './transaction.util';

const ec = new EC('secp256k1');

/**
 * Sign a transaction with a private key.
 * Mutates the transaction object by adding signature field.
 */
export function signTransaction(tx: ITransaction, privateKey: string): ITransaction {
  const key = ec.keyFromPrivate(privateKey, 'hex');

  const txHash = calculateTransactionHash(tx);

  const signature = key.sign(txHash, 'hex');

  tx.signature = signature.toDER('hex');

  return tx;
}
