/**
 * Block Header interface - represents the header part of a block for hash computation.
 * 
 * Note: version and difficulty are optional for backward compatibility,
 * but when hashing, default values are used (version: 1, difficulty from service).
 */
export interface IBlockHeader {
  index: number;
  timestamp: number;
  previous_hash: string;
  merkle_root: string;
  nonce: number;
  version?: number; // Optional for backward compatibility, default: 1
  difficulty?: number; // Optional for backward compatibility, default from service
}

// Backward compatibility alias
export type BlockHeader = IBlockHeader;
