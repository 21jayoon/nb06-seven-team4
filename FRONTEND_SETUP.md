# 프론트엔드-백엔드 연결 설정 가이드

## 현재 설정 상황

### 백엔드 서버

- **포트**: `3000` (`.env`에서 `PORT=3000`)
- **주소**: `http://localhost:3000`
- **CORS_ORIGIN**: `http://localhost:3001` (프론트엔드에서 접근 허용)

### Next.js 프론트엔드 (설정 필요)

- **예상 포트**: `3001` (Next.js 기본 포트는 3000이지만, 백엔드가 3000을 사용 중이므로 3001 사용)
- **주소**: `http://localhost:3001`

## 문서 내용 정리

문서에서 말하는 내용:

### 1. API Base URL 설정

Next.js 프론트엔드 프로젝트의 `.env` 파일에:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**중요**: 문서에서 `http://localhost:3001`이라고 나와 있지만, 실제 백엔드는 **3000 포트**에서 실행 중입니다!

### 2. 이미지 주소 허용 설정

Next.js의 `next.config.ts`에서 이미지 주소를 허용:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',  // 백엔드 포트
    },
  ],
},
```

### 3. API 호출 경로 수정

문서에서 설명하는 부분:

- Next.js에서 백엔드 API를 호출할 때 `/lib/api.ts` 파일을 수정해야 함
- 예를 들어, 페이지네이션 쿼리 파라미터나 응답 형식이 다를 수 있음

## 연결 구조

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   브라우저      │  ────>  │  Next.js 서버   │  ────>  │  Express 백엔드 │
│  (Client)       │         │  (포트: 3001)   │         │  (포트: 3000)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**요청 흐름**: 브라우저 → Next.js 서버(3001) → Express 백엔드(3000)
**응답 흐름**: Express 백엔드(3000) → Next.js 서버(3001) → 브라우저

## 설정 확인 사항

### 1. 백엔드 CORS 설정 확인

- `.env` 파일에서 `CORS_ORIGIN="http://localhost:3001"` 확인 (현재 설정됨)

### 2. Next.js 프론트엔드 설정

Next.js 프로젝트에서:

**`.env.local` 파일 생성:**

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**`next.config.ts` 수정:**

```ts
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',  // 백엔드 포트
    },
  ],
},
```

**`package.json` 스크립트 확인:**

```json
{
  "scripts": {
    "dev": "next dev -p 3001" // 포트 3001에서 실행
  }
}
```

## 테스트 방법

1. 백엔드 서버 실행 (포트 3000):

```bash
npm run dev
```

2. Next.js 프론트엔드 실행 (포트 3001):

```bash
cd [프론트엔드-프로젝트-경로]
npm run dev
# 또는
next dev -p 3001
```

3. 브라우저에서 `http://localhost:3001` 접속

## 문제 해결

### CORS 에러 발생 시

- `.env`에서 `CORS_ORIGIN`이 올바른지 확인
- 백엔드 서버 재시작

### API 호출 실패 시

- Next.js의 `.env.local`에서 `NEXT_PUBLIC_API_URL` 확인
- `/lib/api.ts` 파일에서 API 경로 확인
- 백엔드 서버가 3000 포트에서 실행 중인지 확인
