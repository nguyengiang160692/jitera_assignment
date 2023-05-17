//Create route files
// Path: backend/routers.ts

import express from 'express';
import { UserValidate } from './model/model';
import { createNewuser } from './services';
import { ErrorResponse } from './http/respose'

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi there! again!');
});

//TODO: user get profile
//TODO: add middleware to check token on few routes

// User register
router.post('/user', async (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send(<ErrorResponse>{
            message: 'Content can not be empty!'
        });
    }

    const { error, value } = UserValidate.validate(req.body)

    if (error) {
        return res.status(400).send(<ErrorResponse>{
            message: error.details[0].message,
        })
    }

    //create new user
    const newUser = await createNewuser(value)

    return res.status(201).send({ data: value })
})


//TODO: route to deposit money (this is admin API, deposit for users)

//TODO: route to create new item in draft state (this is admin API)

//TODO: route to get all items with filter (with pagination and sorting)

export default router;