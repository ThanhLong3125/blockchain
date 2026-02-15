import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<TransactionEntity>;

@Schema({ timestamps: true })
export class TransactionEntity {
    @Prop()
    from_address: string;

    @Prop()
    to_address: string;

    @Prop()
    amount: number;

    @Prop()
    signature?: string;
}