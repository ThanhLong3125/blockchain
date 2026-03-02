/**
 * Domain model interface for transactions.
 * Independent of DTO and Entity, used for business logic.
 */
export interface ITransaction {
  from_address: string;
  to_address: string;
  amount: number;
  nonce?: number;
  fee?: number;
  signature?: string;
  hash?: string;
  timestamp?: number;
  tokenId?: string;
}
