import { BlockHeader } from 'src/interfaces/block-header.interface';
import { calculateHash } from './calculate_hash.utils';

/**
 * Mine dựa trên block header: chỉ hash header (bao gồm merkleRoot, difficulty).
 * 
 * Lưu ý: difficulty phải được truyền trong baseHeader để đảm bảo tính đúng.
 */
export function mineBlock(
  baseHeader: Omit<BlockHeader, 'nonce'>,
): { nonce: number; hash: string } {
  if (!baseHeader.difficulty) {
    throw new Error('Difficulty is required for mining');
  }

  let nonce = 0;
  let hash = '';

  while (true) {
    const header: BlockHeader = {
      ...baseHeader,
      nonce,
    };

    hash = calculateHash(header, baseHeader.difficulty);

    if (hash.startsWith('0'.repeat(baseHeader.difficulty))) {
      break;
    }

    nonce++;
  }

  return { nonce, hash };
}
