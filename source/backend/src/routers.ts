//Create route files
// Path: backend/routers.ts

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi there! again!');
});

export default router;