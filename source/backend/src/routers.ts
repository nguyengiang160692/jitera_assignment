//Create route files
// Path: backend/routers.ts

import express from 'express';
import { qualityUser } from './model/model';
import { createNewuser } from './services';
import { ErrorResponse } from './http/respose'

const router = express.Router();

router.get('/index', (req, res) => {
    res.json({
        message: 'Connected APIs'
    });
});

//TODO: user get profile
//TODO: add middleware to check token on few routes

// User register
router.post('/user/register', async (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send(<ErrorResponse>{
            message: 'Content can not be empty!'
        });
    }

    const { error, value } = qualityUser.validate(req.body)

    if (error) {
        return res.status(400).send(<ErrorResponse>{
            message: error.details[0].message,
        })
    }

    //create new user
    try {
        const newUser = await createNewuser(value)

        return res.status(201).send({ data: value })
    } catch (err: any) {

        return res.status(400).send(<ErrorResponse>{
            message: err.message,
        })
    }
})


//TODO: route to deposit money (this is admin API, deposit for users)

//TODO: route to create new item in draft state (this is admin API)

//TODO: route to get all items with filter (with pagination and sorting)

export default router;