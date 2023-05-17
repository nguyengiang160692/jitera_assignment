// Create expressjs application
import express from 'express';
import routers from './routers';
import mongoose from 'mongoose';
import { exit } from 'process';
import dotenv from 'dotenv';

import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3005 // default port to listen;

console.log('App going to load on port', port);

// connect database mongodb
const db_username = process.env.MONGO_USERNAME;
const db_password = process.env.MONGO_PASSWORD;
const db_host = process.env.MONGO_HOST;
const db_port = process.env.MONGO_PORT;
const db_source = process.env.MONGO_SOURCE;

const mongoUri = `mongodb://${db_username}:${db_password}@${db_host}:${db_port}/${db_source}`;

mongoose.connect(mongoUri, {}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    if (err) {
        console.log('Error', err); exit;
    }
});



// more middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', routers);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})

export default app;