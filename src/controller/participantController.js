import prisma from '../libs/database.js';
import AppError from '../libs/error/appError.js';

class ParticipantController {
  // 그룹 참여
  async joinGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { nickname, password } = req.body;

      if (!nickname) {
        return next(new AppError('nickname is required', 400, 'nickname'));
      }

      if (!password) {
        return next(new AppError('password is required', 400, 'password'));
      }

      // 그룹 ID 파싱
      const groupId = parseInt(id);

      if (isNaN(groupId)) {
        return next(new AppError('Invalid group ID', 400));
      }

      // 그룹 존재 확인
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          participants: {
            orderBy: { createdAt: 'asc' },
          },
          medals: true,
        },
      });

      if (!group) {
        return next(new AppError('그룹을 찾을 수 없습니다.', 404));
      }

      // 중복 닉네임 체크
      const existingParticipant = await prisma.participant.findUnique({
        where: {
          groupid_nickname: {
            groupid: groupId,
            nickname,
          },
        },
      });

      if (existingParticipant) {
        return next(new AppError('이미 사용 중인 닉네임입니다.', 409));
      }

      const participant = await prisma.participant.create({
        data: {
          nickname,
          password,
          groupid: groupId,
          isowner: false,
          hasLiked: false,
        },
      });

      // 업데이트된 그룹 정보 조회
      const updatedGroup = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          participants: {
            orderBy: { createdAt: 'asc' },
          },
          medals: true,
        },
      });

      // owner 찾기 (isowner 필드 사용 또는 nickname 매칭)
      let owner = null;
      const ownerParticipant = updatedGroup.participants.find(
        (p) => p.isowner || p.nickname === updatedGroup.nickname,
      );
      if (ownerParticipant) {
        owner = {
          id: ownerParticipant.id,
          nickname: ownerParticipant.nickname,
          createdAt: ownerParticipant.createdAt.getTime(),
          updatedAt: ownerParticipant.updatedAt.getTime(),
        };
      } else {
        owner = {
          id: updatedGroup.id,
          nickname: updatedGroup.nickname,
          createdAt: updatedGroup.createdAt.getTime(),
          updatedAt: updatedGroup.updatedAt.getTime(),
        };
      }

      // 응답 형식 변환
      const response = {
        id: updatedGroup.id,
        name: updatedGroup.name,
        description: updatedGroup.description || '',
        photoUrl: updatedGroup.image || '',
        goalRep: updatedGroup.goldnumber,
        discordWebhookUrl: updatedGroup.discordwebhookurl || '',
        discordInviteUrl: updatedGroup.discordserverinviteurl || '',
        likeCount: updatedGroup.likes,
        tags: updatedGroup.tag,
        owner: owner,
        participants: updatedGroup.participants.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          createdAt: p.createdAt.getTime(),
          updatedAt: p.updatedAt.getTime(),
        })),
        createdAt: updatedGroup.createdAt.getTime(),
        updatedAt: updatedGroup.updatedAt.getTime(),
        badges: updatedGroup.medals.map((m) => m.medaltype),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // 그룹 참여 취소
  async leaveGroup(req, res, next) {
    try {
      const { id } = req.params;

      // 다양한 입력 형식 지원 (JSON, Form data, Plain text)
      let nickname, password;

      if (typeof req.body === 'string') {
        // Plain text 형식 처리 (예: "nickname=test\npassword=123" 또는 "nickname=test&password=123")
        const textBody = req.body.trim();
        if (textBody.includes('&')) {
          // URL encoded 형식
          const params = new URLSearchParams(textBody);
          nickname = params.get('nickname');
          password = params.get('password');
        } else {
          // 줄바꿈 형식
          const lines = textBody.split('\n');
          for (const line of lines) {
            if (line.includes('=')) {
              const [key, value] = line.split('=').map((s) => s.trim());
              if (key === 'nickname') nickname = value;
              if (key === 'password') password = value;
            }
          }
        }
      } else {
        // JSON 또는 Form data 형식
        nickname = req.body.nickname;
        password = req.body.password;
      }

      if (!nickname) {
        return next(new AppError('nickname is required', 400, 'nickname'));
      }

      if (!password) {
        return next(new AppError('password is required', 400, 'password'));
      }

      const groupId = parseInt(id);
      if (isNaN(groupId)) {
        return next(new AppError('Invalid group ID', 400, 'id'));
      }

      const participant = await prisma.participant.findUnique({
        where: {
          groupid_nickname: {
            groupid: groupId,
            nickname,
          },
        },
      });

      if (!participant) {
        return next(new AppError('참여자를 찾을 수 없습니다.', 404));
      }

      if (participant.password !== password) {
        return next(new AppError('Wrong password', 401, 'password'));
      }

      // 참여 취소 시 해당 닉네임의 운동 기록 모두 삭제 (Cascade로 자동 삭제)
      await prisma.participant.delete({
        where: {
          id: participant.id,
        },
      });

      // 204 NO CONTENT - 응답 본문 없음
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ParticipantController();
