# Seven Team 4 – Group Exercise API

Exercise-record 관리용 백엔드 서비스입니다.  
그룹 참여/탈퇴, 운동 기록 집계(주간·월간), 기록 상세 조회 기능을 제공합니다.

배포 링크: https://nb06-seven-team4.onrender.com

## Tech Stack

| Category | Tools                   |
| -------- | ----------------------- |
| Runtime  | Node.js 20+, Express.js |
| ORM      | Prisma                  |
| Database | PostgreSQL              |
| Etc.     | dotenv, cors            |

## Project Structure

```
src/
 ├─ controller/
 │   ├─ participantController.js   # 그룹 참가/탈퇴
 │   └─ rankingController.js       # 랭킹·기록 조회
 ├─ router/
 │   ├─ participantRouter.js
 │   └─ rankingRouter.js
 ├─ libs/
 │   ├─ database.js                # Prisma Client
 │   ├─ constants.js
 │   └─ error/
 │       ├─ appError.js            # 커스텀 에러
 │       └─ errorHandler.js        # Global Error Handler
 └─ main.js                        # Express 앱 엔트리
prisma/
 └─ schema.prisma
```

## Getting Started

```bash
# install
npm install

# env (예: DATABASE_URL, PORT, CORS_ORIGIN)
cp .env.example .env   # 없으면 직접 생성

# prisma
npx prisma migrate deploy 
npx prisma generate
npx prisma db seed

# run
npm run dev
```

환경 변수

| Key            | Description                     |
| -------------- | ------------------------------- |
| `DATABASE_URL` | PostgreSQL 연결 문자열          |
| `PORT`         | 서버 포트 (기본 3000)           |
| `CORS_ORIGIN`  | 허용할 Origin. `*` 면 전체 허용 |

## API Overview

| Method       | Endpoint                                                 | Description   |
|--------------|----------------------------------------------------------|---------------|
| `POST`       | `/groups`                                                | 그룹 생성         |
| `GET`        | `/groups/?page=1&limit=5&orderBy=createdAt&order=desc`   | 그룹 목록 조건 조회   |
| `GET`        | `/groups/:groupId`                                       | 그룹 상세 조회      |
| `PATCH`      | `/groups/:groupId`                                       | 그룹 수정         |
| `DELETE`     | `/groups/:groupId`                                       | 그룹 삭제         |
| ------------ | -------------------------------------------------------- | ------------- |
| `POST`       | `/groups/:groupId/participants`                          | 그룹 참여         |
| `DELETE`     | `/groups/:groupId/participants`                          | 그룹 탈퇴         |
| `GET`        | `/groups/:groupId/rank?duration=weekly\|monthly`         | 그룹 랭킹         |
| `GET`        | `/groups/records/:recordId`                              | 기록 상세         |

### 에러 응답 규칙

모든 핸들러는 `AppError` → `errorHandler`로 전달되며 아래 형식을 반환합니다.

```json
{
  "success": false,
  "message": "설명",
  "path": "필드명(Optional)"
}
```

---

## API Details

### 1. 그룹 생성
`POST /groups`

```json
{
  "groupName": "Exercise_IS_FUN",
  "description": "11월도 운동해요",
  "nickname": "GOOD_EXERCISE_NICE",
  "password": "good_exercise_nice",
  "image": "https://example.com/images/group_logo_A.png",
  "tags": [
    "Running"
  ],
  "discordwebhookurl": "http://discord.gg/exercise_good",
  "discordserverinviteurl": "https://discord.gg/exercise_good",
  "goalNumber": 250
}
```
### 2. 그룹 목록 조회
`GET /groups/?page=1&limit=5&orderBy=createdAt&order=desc`


```markdown
조건: 
orderBy 1. likeCount, 2. participantCount, 3. createdAt
order 1. asc, 2. desc
```

### 3. 그룹 상세 조회

### 4. 그룹 수정

### 5. 그룹 삭제
`DELETE /groups/:groupId`

Responses

- `204 NO CONTENT`

### 6. 그룹 참가

`POST /groups/:groupId/participants`

```json
{
  "nickname": "써밋",
  "password": "pass1234"
}
```

**201 CREATED**

```json
{
  "id": 1,
  "name": "세븐팀",
  "description": "",
  "photoUrl": "",
  "goalRep": 100,
  "discordWebhookUrl": "",
  "discordInviteUrl": "",
  "likeCount": 0,
  "tags": [],
  "owner": {
    "id": 10,
    "nickname": "리더",
    "createdAt": 1728956400000,
    "updatedAt": 1728956400000
  },
  "participants": [
    {
      "id": 10,
      "nickname": "리더",
      "createdAt": 1728956400000,
      "updatedAt": 1728956400000
    },
    {
      "id": 11,
      "nickname": "써밋",
      "createdAt": 1729042800000,
      "updatedAt": 1729042800000
    }
  ],
  "createdAt": 1728870000000,
  "updatedAt": 1729042800000,
  "badges": ["OVERHUNDREADRECORD"]
}
```

**400 BAD REQUEST**

```json
{ "path": "nickname", "message": "nickname is required" }
```

### 7. 그룹 탈퇴

`DELETE /groups/:groupId/participants`

- JSON, Form-Data, Plain text 모두 처리

```json
{ "nickname": "써밋", "password": "pass1234" }
```

Responses

- `204 NO CONTENT`
- `400 BAD REQUEST` : `{ "path": "nickname", "message": "nickname is required" }`
- `401 UNAUTHORIZED` : `{ "path": "password", "message": "Wrong password" }`

### 8. 그룹 랭킹

`GET /groups/:groupId/rank?duration=weekly|monthly`

```json
[
  {
    "participantId": 11,
    "nickname": "써밋",
    "recordCount": 12,
    "recordTime": 540
  },
  {
    "participantId": 10,
    "nickname": "리더",
    "recordCount": 7,
    "recordTime": 310
  }
]
```

### 9. 기록 상세

`GET /groups/records/:recordId`

```json
{
  "exercisetype": "RUN",
  "description": "새벽 러닝",
  "images": ["https://example.com/run-1.jpg", "https://example.com/run-2.jpg"],
  "playtime": 45,
  "distance": 10.5,
  "nickname": "써밋"
}
```

---

## Notes

- Prisma 모델은 `prisma/schema.prisma` 참고
- `src/libs/error/appError.js` 로 모든 비즈니스 예외를 표준화
- README 응답 예시는 실제 데이터에 따라 달라질 수 있습니다.
