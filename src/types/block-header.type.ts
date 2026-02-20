/**
 * Block Header interface - đại diện cho phần header của block dùng để tính hash.
 * 
 * Lưu ý: version và difficulty là optional để tương thích với block cũ,
 * nhưng khi hash luôn dùng default values (version: 1, difficulty từ service).
 */
export interface BlockHeader {
  index: number;
  timestamp: number;
  previous_hash: string;
  merkle_root: string;
  nonce: number;
  version?: number; // Optional để backward compatibility, default: 1
  difficulty?: number; // Optional để backward compatibility, default từ service
}

