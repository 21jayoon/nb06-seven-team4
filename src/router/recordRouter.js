import express from 'express';
import { recordController } from '../controller/recordController.js';
import { catchAsync } from '../libs/catchAsync.js';

const recordRouter = express.Router();


const RecordController = new recordController();
// 그룹 랭킹 조회
recordRouter.post('/', catchAsync(RecordController.CreateRecords));
recordRouter.get('/', catchAsync(RecordController.GetRecords));

export default recordRouter;