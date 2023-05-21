import express from "express";
import passport from "passport";
import { IItem, ItemStatus, Item, qualityItem } from "../model/item";
import { IUser } from "../model/user";
import { addItemToExchange, getItemsOnExchangePagination } from '../services'

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

export default router