import { Jwt, sign } from "jsonwebtoken";
import { User, IUser } from "./model/model";
import { MongoServerError } from 'mongodb'

export const createNewUser = async (model: IUser) => {
    const newUser = new User(model);

    try {
        await newUser.save();

        return newUser;
    } catch (err: any) {
        if (err instanceof MongoServerError && err.code == 11000) {
            throw new Error("User is already exists");
        }

        throw new Error(err.message);
    }
}

// get user from database by username and hashed password from input is raw password
export const getUserByUsernameAndPassword = async (username: string, inputPassword: string): Promise<typeof User | boolean> => {
    try {
        let user: any = await User.findOne({ username: username });

        // compare input hashed password with hashed password in database
        const isMatch = await user?.comparePassword(inputPassword);

        if (isMatch) {
            // success login
            return user;
        }

    } catch (err: any) {
        console.log('Error on getUserByUsernameAndPassword', err.message);
    }

    return false;
}

export const generateNewToken = (payload: any) => {
    const secret: string = process.env.JWT_SECRET as string;

    if (secret) {
        return sign(payload, secret, { expiresIn: '24h' });
    }
}

export const addBalance = async (user: IUser, amount: number): Promise<Boolean> => {
    try {
        user.balance += amount;

        await user.save();

        return true;
    } catch (err: any) {
        console.log(err.message);

        return false;
    }
}