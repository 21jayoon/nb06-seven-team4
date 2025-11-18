import express from 'express';
import participantController from '../controller/participantController.js';

const router = express.Router();

// 그룹 참여
router.post(
  '/groups/:groupId/participants',
  (req, res, next) => {
    req.params.id = req.params.groupId;
    next();
  },
  participantController.joinGroup,
);

// 그룹 참여 취소
router.delete(
  '/groups/:groupId/participants',
  (req, res, next) => {
    req.params.id = req.params.groupId;
    next();
  },
  participantController.leaveGroup,
);

// 그룹 참여 (기존 경로 - 호환성 유지)
router.post('/groups/:id/join', participantController.joinGroup);

// 그룹 참여 취소 (기존 경로 - 호환성 유지)
router.delete('/groups/:id/leave', participantController.leaveGroup);

export default router;
