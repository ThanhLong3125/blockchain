import { ec as EC } from 'elliptic';
import { randomBytes } from 'crypto';

const ec = new EC('secp256k1');

export function createWallet() {
  const keyPair = ec.genKeyPair();

  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');

  return {
    privateKey,
    publicKey,
  };
}
