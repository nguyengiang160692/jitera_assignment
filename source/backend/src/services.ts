import { UserSchema, IUser } from "./model/model";

export const createNewuser = async (model: IUser) => {
    try {
        const newUser = await model.save();
        return newUser;
    } catch (err) {
        throw err;
    }
}