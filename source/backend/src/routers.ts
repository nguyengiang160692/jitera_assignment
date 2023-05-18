//Create route files
// Path: backend/routers.ts

import express from 'express';
import { qualityUser } from './model/model';
import { createNewUser } from './services';
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
router.post('/user/register', (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send(<ErrorResponse>{
            message: 'Content can not be empty!'
        });
    }

    const { error, value } = qualityUser.validate(req.body)

    if (error) {
        res.status(400).send(<ErrorResponse>{
            message: error.details[0].message,
        })
    }

    try {
        //create new user
        createNewUser(value)
            .then((newUser) => {
                res.status(201).send({ data: newUser })
            })
            .catch((err) => {
                res.status(400).send(<ErrorResponse>{
                    message: err.message,
                })
            })
    } catch (err: any) {
        res.status(400).send(<ErrorResponse>{
            message: err.message,
        })
    }
})

router.post('/users/login', (req, res) => {
    if (!req.body) {
        return res.status(400).send(<ErrorResponse>{
            message: 'Content can not be empty!'
        });
    }
})


//TODO: route to deposit money (this is admin API, deposit for users)

//TODO: route to create new item in draft state (this is admin API)

//TODO: route to get all items with filter (with pagination and sorting)

export default router;