import mongoose, { model, Schema, Document } from 'mongoose';
import Joi from 'joi';
import paginate from 'mongoose-paginate-v2';

export enum ItemStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    SOLD = 2,
}

export interface IItemHistory {
    bidder: string;
    bidPrice: number;
    bidAt: Date;
}

export interface IItem extends Document {
    name: string;
    description?: string;
    startPrice: number;
    currentPrice: number;
    status: ItemStatus;
    owner: string;
    lastBidder: string;
    publishAt: Date;
    endAt: Date;
    durationInMinutes: number;
    lastBidAt: Date;
    biddingHistory: IItemHistory[];
}

const ItemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    startPrice: { type: Number, required: true, min: 10 },
    currentPrice: { type: Number, required: true, min: 10 },
    status: { type: Number, enum: [0, 1, 2], default: 0 },
    owner: { type: String, required: true, ref: 'User' },
    lastBidder: { type: String, required: false, ref: 'User' },
    publishAt: { type: Date, required: false },
    endAt: { type: Date, required: false },
    durationInMinutes: { type: Number, required: false, default: 5 },
    lastBidAt: { type: Date, required: false },
    biddingHistory: {
        type: [{
            bidder: { type: String, required: true, ref: 'User' },
            bidPrice: { type: Number, required: true, min: 10 },
            bidAt: { type: Date, required: true },
        }],
        default: []
    }
}, { timestamps: true });

ItemSchema.plugin(paginate);

export const Item = model<IItem, mongoose.PaginateModel<IItem>>('Item', ItemSchema);

export const qualityItem = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    startPrice: Joi.number().required().min(10),
    status: Joi.string().optional().valid(...Object.values(ItemStatus)),
    durationInMinutes: Joi.number().optional().min(1),
});


//TODO: create item schema, have status draft, published, sold, deleted
// this item schema will have a reference to user schema if sold out
// store the last bid user id, and the last bid (aka current highest) amount also
// make sure on save item, the bid amount is higher than the current highest bid amount
// each item have start price, and publish at time, and end time
// each item have owner id

// should have state to manage user last bid on items to prevent fast bidding (allow 5 seconds between each bid on same item)

//TODO: history of transaction bid, deposit, withdraw, buy item, sell item to keep track of user balance, and item transfer