import { createHash } from 'crypto';
import { BlockHeader } from 'src/types/block-header.type';

/**
 * Tính hash cho block header (hash only header, include merkleRoot).
 */
export function calculateHash(header: BlockHeader): string {
  const {
    index,
    timestamp,
    previous_hash,
    merkle_root,
    nonce,
    version,
    difficulty,
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

