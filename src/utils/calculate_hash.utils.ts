import { createHash } from 'crypto';
import { BlockHeader } from 'src/types/block-header.type';

/**
 * Tính hash cho block header (hash only header, include merkleRoot).
 * 
 * Default values:
 * - version: 1 (nếu không có)
 * - difficulty: không có default (phải truyền từ service)
 */
export function calculateHash(
  header: BlockHeader,
  defaultDifficulty?: number,
): string {
  const {
    index,
    timestamp,
    previous_hash,
    merkle_root,
    nonce,
    version = 1, // Default version: 1
    difficulty = defaultDifficulty, // Default từ service nếu có
  } = header;

  return createHash('sha256')
    .update(
      JSON.stringify({
        index,
        timestamp,
        previous_hash,
        merkle_root,
        nonce,
        version,
        difficulty,
      }),
    )
    .digest('hex');
}

