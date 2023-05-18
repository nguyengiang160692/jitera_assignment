import { User, IUser } from "./model/model";

export const createNewuser = async (model: IUser) => {
    const newUser = new User(model);

    try {
        // Must have await ! this is very dangerous promise always forget
        await newUser.save();

        return newUser;
    } catch (err: any) {
        throw new Error(err.message);
    }
}