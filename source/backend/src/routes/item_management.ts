import express from "express";
import passport from "passport";
import { IItem, ItemStatus, Item, qualityItem } from "../model/item";
import { IUser } from "../model/user";
import { addItemToExchange, getItemsOnExchangePagination, bidItemOnExchange } from '../services'
import { Request, Response } from 'express';

import Joi from 'joi';
import { ErrorResponse, SuccessResponse } from "../http/respose";

const router = express.Router();

router.use(passport.authenticate('bearer', { session: false }))

const middlewareValidateItem = async (req: Request, res: Response, next: any) => {
    if (!req.body) {
        return res.status(400).send(<ErrorResponse>{
            message: "Content can not be empty!"
        });
    }

    let id = req.params.id;

    let bidItem = await Item.findById(id);

    if (!bidItem) {
        return res.status(400).send(<ErrorResponse>{
            message: "Item not found!"
        });
    }

    next();
}

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
        return res.status(200).send(<SuccessResponse>{
            data: result,
            message: "Successfully get data"
        });

    res.status(400).send(<ErrorResponse>{
        message: "Fail to get data"
    });
})

router.put('/:id/publish', middlewareValidateItem, async (req, res) => {
    //get user from passport
    let id = req.params.id;
    let user = req.user as IUser;

    let bidItem: IItem | null = await Item.findById(id);

    if (bidItem?.owner != user._id) {
        return res.status(400).send(<ErrorResponse>{
            message: "You can not publish this item!"
        });
    }

    if (bidItem) {
        bidItem.publishAt = new Date();
        bidItem.endAt = new Date(new Date().getTime() + (bidItem.durationInMinutes * 60 * 1000));
        bidItem.status = ItemStatus.PUBLISHED;

        await bidItem.save()

        return res.status(200).send(<SuccessResponse>{
            message: "Successfully publish item"
        })
    }

    return res.status(400).send(<ErrorResponse>{
        message: "Unable to publish item"
    })
})

//bid item
router.put('/:id/bid', middlewareValidateItem, async (req, res) => {
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
        return;
    }

    if (bidItem.status != ItemStatus.PUBLISHED) {
        return res.status(400).send(<ErrorResponse>{
            message: "Item not available!"
        });
    }

    if (bidItem.owner == user._id) {
        return res.status(400).send(<ErrorResponse>{
            message: "You can not bid your item!"
        });
    }

    if (bidItem.currentPrice >= bidPrice) {
        return res.status(400).send(<ErrorResponse>{
            message: "Your bid must be higher than current price!"
        });
    }

    //check if last bid at compare with current time must be 5 secs 
    if (bidItem.lastBidAt) {
        let nextBidAvailableSecs = bidItem.lastBidAt.getTime() + (5 * 1000);
        let currentBidSecs = (new Date()).getTime()
        if (nextBidAvailableSecs > currentBidSecs) {
            return res.status(400).send(<ErrorResponse>{
                message: "You can not bid now!"
            });
        }
    }

    try {
        await bidItemOnExchange(bidItem, user, bidPrice);
        return res.status(200).send(<SuccessResponse>{
            message: "Bid item success!"
        });
    } catch (err: any) {
        return res.status(400).send(<ErrorResponse>{
            message: err.message
        });
    }
})


export default router