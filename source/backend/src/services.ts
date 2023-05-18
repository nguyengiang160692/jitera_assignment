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
    }
}