import express from "express";
import passport from "passport";
import { IItem, ItemStatus, Item, qualityItem } from "../model/item";
import { IUser } from "../model/user";
import { addItemToExchange, getItemsOnExchangePagination, bidItemOnExchange } from '../services'

import Joi from 'joi';
import { ErrorResponse } from "../http/respose";

const router = express.Router();

router.use(passport.authenticate('bearer', { session: false }))

// create new item
router.post('/', async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //get user from passport
    let user = req.user as IUser;

    const { error, value } = qualityItem.validate(req.body)

    if (error) {
        return res.status(400).send(<ErrorResponse>{
            message: error.details[0].message,
        })
    }

    //make it simple by add update balance
    let result = await addItemToExchange(value as IItem, user);

    if (result)
        return res.status(200).send({
            message: "Create item success!"
        });

    res.status(400).send({
        message: "Fail to create item!"
    });
})

// get all items
router.get('/', async (req, res) => {
    let result: IItem[] = []

    result = await getItemsOnExchangePagination();

    if (result)
        return res.status(200).send({
            data: result,
            message: "Successfully get data"
        });

    res.status(400).send({
        message: "Fail to get data"
    });
})

//bid item
router.put('/:id/bid', async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //get user from passport
    let user = req.user as IUser;
    let id = req.params.id;
    let bidPrice = req.body.bidPrice;

    let bidItem = await Item.findById(id);

    if (!bidItem) {
        return res.status(400).send({
            message: "Item not found!"
        });
    }

    if (bidItem.status != ItemStatus.PUBLISHED) {
        return res.status(400).send({
            message: "Item not available!"
        });
    }

    if (bidItem.owner == user._id) {
        return res.status(400).send({
            message: "You can not bid your item!"
        });
    }

    if (bidItem.currentPrice >= bidPrice) {
        return res.status(400).send({
            message: "Your bid must be higher than current price!"
        });
    }

    //check if last bid at compare with current time must be 5 secs 
    let nextBidAvailableSecs = bidItem.lastBidAt.getTime() + (5 * 1000);
    let currentBidSecs = (new Date()).getTime()
    if (nextBidAvailableSecs > currentBidSecs) {
        return res.status(400).send({
            message: "You can not bid now!"
        });
    }

    try {
        await bidItemOnExchange(bidItem, user, bidPrice);
        return res.status(200).send({
            message: "Bid item success!"
        });
    } catch (err: any) {
        return res.status(400).send({
            message: err.message
        });
    }

    return res.status(200).send({
        message: "Bid item success!"
    });
})

export default router