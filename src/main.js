import express from 'express';
import { PORT } from './libs/constants.js';
import cors from 'cors';
import groupInteractionRouter from './routers/groupInteractionRouter.js';

const app = express();
app.use(cors());
app.use(express.json());




app.use('/groups/:id/likes', groupInteractionRouter);

app.listen(PORT, () => {
    console.log("Server is Online");
});