/**
 * DTO for transaction response after preparation.
 * This is what backend returns after computing nonce, timestamp, hash.
 * Client uses this to sign locally.
 */
export class TransactionResponseDto {
  from_address: string;
  to_address: string;
  amount: number;
  fee?: number;
  nonce: number;
  timestamp: number;
  hash: string;
}
