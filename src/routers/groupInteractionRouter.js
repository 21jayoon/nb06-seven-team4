import { Prisma } from '@prisma/client';
import express from 'express';
import { PostGroupLike, DeleteGroupLike } from '../controller/groupController.js';
const groupInteractionRouter = express.Router({ mergeParams: true });//상위 라우터 파람을 내 파람으로 병합해줘

groupInteractionRouter.route('/')
    .post(PostGroupLike)
    .delete(DeleteGroupLike);



//그룹 라우터 내 에러 처리
groupInteractionRouter.use((err, req, res, next) => {
    console.error(err.name);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == 'P2025') {
        res.sendStatus(404);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == 'P2002') {
        res.status(400).send({ message: err.message });
    } else if (err.name == 'StructError') {
        res.status(400).send({ message: err.message });
    } else {
        res.status(500).send({ message: err.message });
    }


});



export default grouprouter;