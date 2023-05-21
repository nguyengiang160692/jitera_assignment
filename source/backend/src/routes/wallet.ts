import express from "express";
import passport from "passport";
import { addBalance } from '../services'
import { IUser } from "../model/user";

import Joi from 'joi';

const router = express.Router();

router.use(passport.authenticate('bearer', { session: false }))

router.post('/deposit', async (req, res) => {
    //deposit money for user
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //get user from passport
    let user = req.user as IUser;

    const { error, value } = Joi.object({
        amount: Joi.number().required().min(1),
    }).validate(req.body)

    if (error) {
        return res.status(400).send(<ErrorResponse>{
            message: error.details[0].message,
        })
    }

    //make it simple by add update balance
    let result = await addBalance(user, value.amount || 0);

    if (result)
        return res.status(200).send({
            message: "Deposit success!"
        });

    res.status(400).send({
        message: "Deposit failed!"
    });
})

export default router