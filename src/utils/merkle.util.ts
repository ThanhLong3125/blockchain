import { createHash } from 'crypto';
import { TransactionEntity } from 'src/entities/transaction.entity';

function hashLeaf(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

function hashPair(left: string, right: string): string {
  return createHash('sha256').update(left + right).digest('hex');
}

export function calculateMerkleRoot(
  transactions: TransactionEntity[],
): string {
  if (!transactions || transactions.length === 0) {
    // Merkle root cho danh sách rỗng – có thể chuẩn hoá tuỳ ý
    return '';
  }

  // Hash từng transaction (dùng JSON ổn cho demo, thực tế nên dùng txId)
  let level: string[] = transactions.map((tx) =>
    hashLeaf(JSON.stringify(tx)),
  );

  while (level.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left; // nếu lẻ, nhân đôi node cuối
      nextLevel.push(hashPair(left, right));
    }

    level = nextLevel;
  }

  return level[0];
}

