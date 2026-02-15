import { ec as EC } from 'elliptic';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { calculateTransactionHash } from './transaction.util';

const ec = new EC('secp256k1');

export function signTransaction(tx: TransactionEntity, privateKey: string) {
  const key = ec.keyFromPrivate(privateKey, 'hex');

  const txHash = calculateTransactionHash(tx);

  const signature = key.sign(txHash, 'hex');

  tx.signature = signature.toDER('hex');

  return tx;
}
