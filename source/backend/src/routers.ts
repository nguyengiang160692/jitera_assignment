//Create route files
// Path: backend/routers.ts

import express from 'express';
import { User, IUser, qualityUser } from './model/model';
import { createNewUser, getUserByUsernameAndPassword, generateNewToken } from './services';
import { ErrorResponse, SuccessResponse } from './http/respose'
import passport from 'passport';

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

        if (returnUser instanceof User && returnUser) {

            // ok let generate new token, becauseful on payload, because JWT is not encrypted model
            const token = generateNewToken({
                username: returnUser.username,
                balance: returnUser.balance,
            })

            if (token) {
                // save the token to database
                returnUser.token = token || '';

                await returnUser.save();

                const response: SuccessResponse = {
                    data: {
                        token: token
                    },
                    message: 'Login success!',
                    code: 200
                }

                return res.status(200).send(response)
            }
        }

        res.status(400).send(<ErrorResponse>{
            message: 'Wrong username or password!'
        });
    } catch (err: any) {
        res.status(400).send(<ErrorResponse>{
            message: err.message,
        })
    }
})

interface Profile extends Express.User {
    username?: string;
    balance?: number;
}

router.get('/auth/profile', passport.authenticate('bearer', { session: false }), (req, res) => {
    //load profile of user
    const authUser: Profile = req.user as Profile;

    if (authUser) {
        //get the profile base on authUser
        const response: SuccessResponse = {
            data: {
                username: authUser.username,
                balance: authUser.balance,
            },
            message: 'Get profile success!',
            code: 200
        }

        return res.status(200).send(response)
    }
})

//TODO implement this by revoke token
router.post('/auth/logout', passport.authenticate('bearer', { session: false }), async (req, res) => {
    const authUser: IUser = req.user as IUser;

    if (authUser) {
        authUser.token = '';
        await authUser.save();

        const response: SuccessResponse = {
            data: null,
            message: 'Logout success!',
            code: 200
        }

        return res.status(200).send(response)
    }
})

//TODO: route to deposit money (this is admin API, deposit for users)

//TODO: route to create new item in draft state (this is admin API)

//TODO: route to get all items with filter (with pagination and sorting)

export default router;