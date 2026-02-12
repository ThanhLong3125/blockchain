import { createHash } from 'crypto';
import { NftEntity } from 'src/entities/nft.entity';

export function calculateHash(
  index: number,
  timestamp: number,
  nfts: NftEntity[],
  previousHash: string,
  nonce: number,
): string {
  const nftString = JSON.stringify(nfts);

  const data =
    index.toString() +
    timestamp.toString() +
    nftString +
    previousHash +
    nonce.toString();

  return createHash('sha256').update(data).digest('hex');
}
