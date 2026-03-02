import { createHash } from 'crypto';
import { BlockHeader } from 'src/interfaces/block-header.interface';
import { IBlockHeader } from 'src/interfaces/block-header.interface';

/**
 * Tính hash cho block header dùng canonical string format.
 * Order: index|timestamp|previous_hash|merkle_root|nonce|version|difficulty
 *
 * Default values:
 * - version: 1 (nếu không có)
 * - difficulty: không có default (phải truyền từ service)
 */
export function calculateHash(
  header: BlockHeader | IBlockHeader,
  defaultDifficulty?: number,
): string {
  const {
    index,
    timestamp,
    previous_hash,
    merkle_root,
    nonce,
    version = 1,
    difficulty = defaultDifficulty,
  } = header;

  // Canonical string format: stable order, no JSON parsing ambiguity
  const data = `${index}|${timestamp}|${previous_hash}|${merkle_root}|${nonce}|${version}|${difficulty}`;

  return createHash('sha256').update(data).digest('hex');
}
