import { SchemaFactory } from "@nestjs/mongoose";
import { BlockChainEntity } from "src/entities/blockchain.entity";

export const BlockChainSchema = SchemaFactory.createForClass(BlockChainEntity)