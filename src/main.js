import express from 'express';
import { PORT } from './libs/constants.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());




app.listen(PORT, () => {
    console.log("Server is Online");
});