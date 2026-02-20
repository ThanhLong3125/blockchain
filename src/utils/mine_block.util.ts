import { BlockHeader } from 'src/types/block-header.type';
import { calculateHash } from './calculate_hash.utils';

/**
 * Mine dựa trên block header: chỉ hash header (bao gồm merkleRoot, difficulty).
 */
export function mineBlock(
  baseHeader: Omit<BlockHeader, 'nonce'>,
): { nonce: number; hash: string } {
  let nonce = 0;
  let hash = '';

  while (true) {
    const header: BlockHeader = {
      ...baseHeader,
      nonce,
    };

    hash = calculateHash(header);

    if (hash.startsWith('0'.repeat(header.difficulty))) {
      break;
    }

    nonce++;
  }

  return { nonce, hash };
}
