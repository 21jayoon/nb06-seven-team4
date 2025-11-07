import prisma from './database.js';

/**
 * 그룹에 배지 부여 조건을 확인하고 배지를 부여합니다.
 * @param {number} groupId - 그룹 ID
 */
export async function checkAndAwardBadges(groupId) {
  try {
    // 그룹 정보 조회
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        participants: true,
        medals: true,
      },
    });

    if (!group) {
      return;
    }

    // 운동 기록 수 조회
    // TODO: ExerciseRecord 모델에 groupId 관계 필드 추가 필요
    // 현재 스키마에는 관계가 없으므로 Participant를 통해 간접적으로 계산
    // 또는 스키마 수정 후 groupId로 직접 조회 가능
    const participants = group.participants.map((p) => p.id);
    const recordCount =
      participants.length > 0
        ? await prisma.exerciseRecord.count({
            // ExerciseRecord에 participantId 필드가 추가되면 이 조건 사용 가능
            // where: { participantId: { in: participants } }
          })
        : 0;

    // 임시: 스키마에 관계가 없으므로 0으로 설정 (나중에 스키마 수정 후 변경 필요)
    const actualRecordCount = 0;

    const participantCount = group.participants.length;
    const likeCount = group.likes;

    // 이미 부여된 배지 타입들
    const awardedBadges = group.medals.map((medal) => medal.medaltype);

    // OVERTENMEMBER: 참여자 수가 10명 이상
    if (participantCount >= 10 && !awardedBadges.includes('OVERTENMEMBER')) {
      await prisma.medal.create({
        data: {
          medaltype: 'OVERTENMEMBER',
          groupid: groupId,
        },
      });
    }

    // OVERHUNDREADRECORD: 운동 기록이 100개 이상
    if (actualRecordCount >= 100 && !awardedBadges.includes('OVERHUNDREADRECORD')) {
      await prisma.medal.create({
        data: {
          medaltype: 'OVERHUNDREADRECORD',
          groupid: groupId,
        },
      });
    }

    // OVERHUNDREADLIKE: 좋아요 수가 100개 이상
    if (likeCount >= 100 && !awardedBadges.includes('OVERHUNDREADLIKE')) {
      await prisma.medal.create({
        data: {
          medaltype: 'OVERHUNDREADLIKE',
          groupid: groupId,
        },
      });
    }
  } catch (error) {
    console.error('배지 부여 중 오류:', error);
    // 배지 부여 실패는 전체 프로세스를 중단하지 않음
  }
}
