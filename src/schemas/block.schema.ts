import { SchemaFactory } from "@nestjs/mongoose";
import { BlockEntity } from "src/entities/block.entity";

export const BlockSchema = SchemaFactory.createForClass(BlockEntity)