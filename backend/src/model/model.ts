import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt'

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    salt?: string;
}

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    salt: { type: String, require: true }
});

//pre save User to database make sure password is hashed and salted
const saltRounds = 10;

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = bcrypt.genSaltSync(saltRounds);

        return bcrypt.hash(this.password, salt, (err: CallbackError, hash: string) => {
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
