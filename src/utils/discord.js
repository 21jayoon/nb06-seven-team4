// utils/discord.js (또는 컨트롤러 파일 하단)

export async function sendDiscordNotification(webhookUrl, recordData, groupName) {
    if (!webhookUrl) return; // URL이 없으면 그냥 종료

    try {
        // 디스코드 웹훅 메시지 포맷 (Embed 방식이 예쁩니다)
        const payload = {
            username: "운동 알리미", // 봇 이름
            // avatar_url: "이미지 주소", // 봇 프로필 사진 (선택)
            embeds: [
                {
                    title: ` ${groupName} 그룹에 새 기록이 올라왔어요!`,
                    description: `${recordData.nickname}님이 운동을 완료했습니다.`,
                    color: 0x00ccff,
                    fields: [
                        {
                            name: "운동 종류",
                            value: recordData.exerciseType,
                            inline: true
                        },
                        {
                            name: "시간 / 거리",
                            value: `${recordData.time}분 / ${recordData.distance}km`,
                            inline: true
                        },
                        {
                            name: "한줄 평",
                            value: recordData.description || "내용 없음"
                        }
                    ],
                    // 사진이 있다면 썸네일로 표시
                    thumbnail: recordData.photos && recordData.photos.length > 0
                        ? { url: recordData.photos[0] }
                        : undefined,
                    footer: {
                        text: "지금 바로 확인해보세요!"
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        // 디스코드 서버로 POST 요청 전송
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("디스코드 알림 전송 성공");

    } catch (error) {
        console.error("디스코드 알림 전송 실패:", error);
        // 알림 실패가 운동 기록 저장을 막으면 안 되므로 에러를 던지지는 않습니다.
    }
}