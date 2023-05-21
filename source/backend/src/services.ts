import { Jwt, sign } from "jsonwebtoken";
import { User, IUser } from "./model/user";
import { MongoServerError } from 'mongodb'
import { Item, IItem, ItemStatus } from "./model/item";

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

// add new item to bid on the list

export const addItemToExchange = async (item: IItem, user: IUser): Promise<Boolean> => {

    try {
        const newItem = new Item(item);

        //compare current publish time with current time
        //if greater than now, then set as draft wait to publish

        if (newItem.publishAt > new Date()) {
            newItem.status = ItemStatus.DRAFT;
        } else {
            newItem.status = ItemStatus.PUBLISHED;
        }

        newItem.currentPrice = item.startPrice;
        newItem.owner = user._id;

        await newItem.save();

        return true;
    } catch (err: any) {
        console.log(err.message);

        return false;
    }
}

// pagination   
export const getItemsOnExchangePagination = async (): Promise<IItem[]> => {
    try {
        // temporary forget about pagination :D 
        let items: any = await Item.paginate({}, { page: 1, limit: 9999999 });

        return items;
    } catch (err: any) {
        console.log(err.message);

        return [];
    }
}

export const bidItemOnExchange = async (item: IItem, bidder: IUser, amount: number): Promise<Boolean> => {
    try {
        item.lastBidder = bidder._id;
        item.lastBidAmount = amount;
        await item.save();

        return true;
    }
    catch (err: any) {
        console.log(err.message);

        return false;
    }
}  
