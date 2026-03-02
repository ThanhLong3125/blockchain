import { createHash } from 'crypto';
import { ITransaction } from 'src/interfaces/transaction.interface';
import { calculateTransactionHash } from './transaction.util';

function hashLeaf(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

function hashPair(left: string, right: string): string {
  return createHash('sha256').update(left + right).digest('hex');
}

export function calculateMerkleRoot(
  transactions: ITransaction[],
): string {
  if (!transactions || transactions.length === 0) return '';

  // Use transaction canonical hash when available; otherwise compute it
  let level: string[] = transactions.map((tx) => {
    const leaf = tx.hash ?? calculateTransactionHash(tx);
    return hashLeaf(leaf);
  });

  while (level.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      nextLevel.push(hashPair(left, right));
    }
    level = nextLevel;
  }

  return level[0];
}

