import mongoose, { model, Schema, Document } from 'mongoose';
import Joi from 'joi';
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    username: string;
    password: string;
    balance: number;
    salt?: string;
    token: string
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    balance: { type: Number, default: 0 },
    token: { type: String },
}, { timestamps: true });

//pre save User to database make sure password is hashed and salted
const saltRounds = 10;

//TODO: fix issue on saving without hash password

UserSchema.pre<IUser>('save', async function (next) {
    //only execute code below if password is modified or new user 
    if (this.isNew) {
        //go on below
    } else if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = bcrypt.genSaltSync(saltRounds);

        return bcrypt.hash(this.password, salt, (err: any, hash: string) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            this.salt = salt;
            this.save()

            return next();

        });
    } catch (err: any) {
        return next(err);
    }
})

export const User = model<IUser>('User', UserSchema);

export const qualityUser = Joi.object({
    username: Joi.string().required().max(32),
    //require password complex
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
        })
})

//TODO: create item schema, have status draft, published, sold, deleted
// this item schema will have a reference to user schema if sold out
// store the last bid user id, and the last bid (aka current highest) amount also
// make sure on save item, the bid amount is higher than the current highest bid amount
// each item have start price, and publish at time, and end time
// each item have owner id

// should have state to manage user last bid on items to prevent fast bidding (allow 5 seconds between each bid on same item)

//TODO: history of transaction bid, deposit, withdraw, buy item, sell item to keep track of user balance, and item transfer