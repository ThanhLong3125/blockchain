import { Prop, Schema } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class NftEntity {
    @Prop()
    tokenId: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    image_url: string;

    @Prop()
    owner_address: string;

    createdAt: Date;
}