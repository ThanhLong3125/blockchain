import { Prop, Schema } from "@nestjs/mongoose";
import { BlockDocument } from "./block.entity";
import { HydratedDocument, HydrateOptions } from "mongoose";

export type BlockChainDocument = HydratedDocument<BlockChainEntity>

@Schema({timestamps: true})
export class BlockChainEntity {
    @Prop()
    chain: BlockDocument[]
}