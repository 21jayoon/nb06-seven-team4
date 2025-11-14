import express from 'express';
import { recordController } from '../controller/recordController.js';
import { catchAsync } from '../libs/catchAsync.js';

const recordRouter = express.Router();


const recordController = new recordController();
// 그룹 랭킹 조회
recordRouter.post('/', catchAsync(recordController.CreateRecords));
recordRouter.get('/', catchAsync(recordController.GetRecords));

export default recordRouter;