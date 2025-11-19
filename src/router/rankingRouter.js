import express from 'express';
import rankingController from '../controller/rankingController.js';

const router = express.Router();

// 그룹 랭킹 조회
router.get(
  '/groups/:groupId/rank',
  (req, res, next) => {
    req.params.id = req.params.groupId;
    next();
  },
  rankingController.getGroupRanking,
);

// 기록 상세 조회
router.get('/records/:recordId', rankingController.getRecordDetail);

export default router;
