import { NftEntity } from 'src/entities/nft.entity';
import { calculateHash } from './calculate_hash.utils';

export function mineBlock(
  difficulty: number,
  block: {
    index: number;
    timestamp: number;
    nfts: NftEntity[];
    previousHash: string;
  },
): { nonce: number; hash: string } {
  let nonce = 0;
  let hash = '';

  while (true) {
    hash = calculateHash(
      block.index,
      block.timestamp,
      block.nfts,
      block.previousHash,
      nonce,
    );

    if (hash.startsWith('0'.repeat(difficulty))) {
      break;
    }

    nonce++;
  }

  return { nonce, hash };
}
