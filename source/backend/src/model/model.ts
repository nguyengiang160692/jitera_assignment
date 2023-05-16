import mongoose, { CallbackError } from 'mongoose';
import Joi from 'joi';
import bcrypt from 'bcrypt'

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    balance: number;
    salt?: string;
    token: string
}

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    balance: { type: Number, default: 0 },
    token: { type: String }
});

export const UserValidate = Joi.object({
    username: Joi.string().required().max(32),
    //require password complex
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.',
        })
})

//pre save User to database make sure password is hashed and salted
const saltRounds = 10;

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
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

            return next();

        });
    } catch (err: any) {
        return next(err);
    }
})


//TODO: create item schema, have status draft, published, sold, deleted
// this item schema will have a reference to user schema if sold out
// store the last bid user id, and the last bid (aka current highest) amount also
// make sure on save item, the bid amount is higher than the current highest bid amount
// each item have start price, and publish at time, and end time
// each item have owner id

// should have state to manage user last bid on items to prevent fast bidding (allow 5 seconds between each bid on same item)

//TODO: history of transaction bid, deposit, withdraw, buy item, sell item to keep track of user balance, and item transfer