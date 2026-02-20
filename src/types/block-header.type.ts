export interface BlockHeader {
  index: number;
  timestamp: number;
  previous_hash: string;
  merkle_root: string;
  nonce: number;
  version: number;
  difficulty: number;
}

