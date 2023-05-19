//Create route files
// Path: backend/routers.ts

import express from 'express';
import { User, qualityUser } from './model/model';
import { createNewUser, getUserByUsernameAndPassword, generateNewToken } from './services';
import { ErrorResponse, SuccessResponse } from './http/respose'

const router = express.Router();

router.get('/index', (req, res) => {
    res.json({
        message: 'Connected APIs'
    });
});

//TODO: user get profile
//TODO: add middleware to check token on few routes

// User register
router.post('/auth/register', (req, res) => {
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
                const response: SuccessResponse = {
                    data: newUser,
                    message: 'Register success!',
                    code: 201
                }
                res.status(201).send(response)
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

router.post('/auth/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).send(<ErrorResponse>{
            message: 'Content can not be empty!'
        });
    }

    try {
        let returnUser = await getUserByUsernameAndPassword(req.body.username, req.body.password)

        if (returnUser instanceof User) {
            // ok let generate new token
            const token = generateNewToken(returnUser.toJSON())

            const response: SuccessResponse = {
                data: {
                    token: token
                },
                message: 'Login success!',
                code: 200
            }

            res.status(200).send(response)

        } else {
            res.status(400).send(<ErrorResponse>{
                message: 'Wrong username or password!'
            });
        }
    } catch (err: any) {
        res.status(400).send(<ErrorResponse>{
            message: err.message,
        })
    }

})

//TODO implement this by revoke token
router.post('/auth/logout', (req, res) => {

})

//TODO: route to deposit money (this is admin API, deposit for users)

//TODO: route to create new item in draft state (this is admin API)

//TODO: route to get all items with filter (with pagination and sorting)

export default router;