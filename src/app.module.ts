import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainController } from './controller/blockchain.controller';
import { BlockchainService } from './services/blockchain.service';
import { BlockEntity } from './entities/block.entity';
import { BlockSchema } from './schemas/block.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/blockchain',
    ),
    MongooseModule.forFeature([
      { name: BlockEntity.name, schema: BlockSchema },
    ]),
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class AppModule {}
