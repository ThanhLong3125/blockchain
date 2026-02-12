import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainController } from './controller/blockchain.controller';
import { BlockChainService } from './services/blockchain.service';
import { BlockService } from './services/block.service';
import { BlockEntity } from './entities/block.entity';
import { BlockChainEntity } from './entities/blockchain.entity';
import { BlockSchema } from './schemas/block.schema';
import { BlockChainSchema } from './schemas/blockchain.schema';
import { BlockController } from './controller/block.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/blockchain',
    ),
    MongooseModule.forFeature([
      { name: BlockEntity.name, schema: BlockSchema },
      { name: BlockChainEntity.name, schema: BlockChainSchema },
    ]),
  ],
  controllers: [BlockchainController, BlockController],
  providers: [BlockChainService, BlockService],
})
export class AppModule {}
