// Create expressjs application
import express from 'express';
import dotenv from 'dotenv';
import routers from './routers';

const app = express();
const port = process.env.PORT || 3005 // default port to listen;


console.log('App going to load on port', port);

app.get('/', (req, res) => {
    res.send('Hi there!');
})

// more middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routers);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})

export default app;