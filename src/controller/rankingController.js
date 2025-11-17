import prisma from '../libs/database.js';
import AppError from '../libs/error/appError.js';

class RankingController {
  // 그룹 랭킹 조회
  async getGroupRanking(req, res, next) {
    try {
      const { id } = req.params;
      const groupId = parseInt(id);

      if (isNaN(groupId)) {
        return next(new AppError('Invalid group ID', 400, 'id'));
      }

      const { duration = 'weekly' } = req.query; // weekly, monthly

      // duration 유효성 검사
      if (duration !== 'weekly' && duration !== 'monthly') {
        return next(new AppError("duration must be 'weekly' or 'monthly'", 400, 'duration'));
      }

      // 기간 계산
      const now = new Date();
      let startDate;
      if (duration === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        // 주간: 오늘로부터 7일 전
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      }

      // 그룹 존재 확인
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) {
        return next(new AppError('그룹을 찾을 수 없습니다.', 404));
      }

      // 기간 내 기록 조회 (participantId 포함)
      const records = await prisma.exerciseRecord.findMany({
        where: {
          groupId: groupId,
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          playtime: true,
          participantId: true,
          participant: {
            select: {
              nickname: true,
            },
          },
        },
      });

      // 닉네임별 집계 (participantId 포함)
      const rankingMap = {};
      records.forEach((record) => {
        const nickname = record.participant.nickname;
        if (!rankingMap[nickname]) {
          rankingMap[nickname] = {
            participantId: record.participantId,
            nickname: nickname,
            recordCount: 0,
            recordTime: 0,
          };
        }
        rankingMap[nickname].recordCount++;
        rankingMap[nickname].recordTime += record.playtime;
      });

      // 랭킹 배열로 변환 및 정렬 (기록 횟수 많은 순)
      const ranking = Object.values(rankingMap).sort((a, b) => b.recordCount - a.recordCount);

      // 응답 형식 정리 (닉네임, 기록 횟수, 누적 시간)
      const response = ranking.map((item) => ({
        nickname: item.nickname,
        recordCount: item.recordCount,
        totalTime: item.recordTime,
      }));

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 기록 상세 조회
  async getRecordDetail(req, res, next) {
    try {
      const { recordId } = req.params;
      const recordIdInt = parseInt(recordId);

      if (isNaN(recordIdInt)) {
        return next(new AppError('Invalid record ID', 400, 'recordId'));
      }

      // 기록 조회 (운동 종류, 설명, 사진, 시간, 거리, 닉네임 포함)
      const record = await prisma.exerciseRecord.findUnique({
        where: { id: recordIdInt },
        select: {
          exercisetype: true,
          description: true,
          images: true,
          playtime: true,
          distance: true,
          participant: {
            select: {
              nickname: true,
            },
          },
        },
      });

      if (!record) {
        return next(new AppError('기록을 찾을 수 없습니다.', 404));
      }

      // 응답 형식
      const response = {
        exercisetype: record.exercisetype,
        description: record.description || '',
        images: record.images || [],
        playtime: record.playtime,
        distance: record.distance,
        nickname: record.participant.nickname,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new RankingController();
