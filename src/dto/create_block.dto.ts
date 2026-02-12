import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NftEntity } from 'src/entities/nft.entity';

export class CreateBlockDto {
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @IsNotEmpty()
  nfts: NftEntity[];

  @IsNotEmpty()
  @IsString()
  previous_hash: string;
}
