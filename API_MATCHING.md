# 프론트엔드-백엔드 API 매칭 현황

## ✅ 연결된 API (백엔드에 구현됨)

### 1. 그룹 참가

- **프론트엔드**: `POST /groups/${groupId}/participants`
- **백엔드**: `POST /groups/:groupId/participants`
- **상태**: ✅ 매칭됨

### 2. 그룹 탈퇴

- **프론트엔드**: `DELETE /groups/${groupId}/participants`
- **백엔드**: `DELETE /groups/:groupId/participants`
- **상태**: ✅ 매칭됨

### 3. 랭킹 조회

- **프론트엔드**: `GET /groups/${groupId}/rank?duration=${duration}`
- **백엔드**: `GET /groups/:groupId/rank?duration=weekly|monthly`
- **상태**: ✅ 매칭됨

### 4. 기록 상세 조회

- **프론트엔드**: `GET /groups/records/${recordId}` (프론트엔드에서 호출하지 않음)
- **백엔드**: `GET /groups/records/:recordId`
- **상태**: ✅ 구현됨 (프론트엔드에서 사용 안 함)

## ❌ 백엔드에 없는 API (프론트엔드가 호출함)

### 1. 그룹 목록 조회

- **프론트엔드**: `GET /groups` (쿼리 파라미터: page, limit, order, orderBy, search)
- **백엔드**: ❌ 없음

### 2. 그룹 상세 조회

- **프론트엔드**: `GET /groups/${groupId}`
- **백엔드**: ❌ 없음

### 3. 그룹 생성

- **프론트엔드**: `POST /groups`
- **백엔드**: ❌ 없음

### 4. 그룹 수정

- **프론트엔드**: `PATCH /groups/${groupId}`
- **백엔드**: ❌ 없음

### 5. 그룹 삭제

- **프론트엔드**: `DELETE /groups/${groupId}`
- **백엔드**: ❌ 없음

### 6. 그룹 좋아요

- **프론트엔드**: `POST /groups/${groupId}/likes`
- **백엔드**: ❌ 없음

### 7. 그룹 좋아요 취소

- **프론트엔드**: `DELETE /groups/${groupId}/likes`
- **백엔드**: ❌ 없음

### 8. 기록 목록 조회

- **프론트엔드**: `GET /groups/${groupId}/records` (쿼리 파라미터: page, limit, order, orderBy, search)
- **백엔드**: ❌ 없음

### 9. 기록 생성

- **프론트엔드**: `POST /groups/${groupId}/records`
- **백엔드**: ❌ 없음

### 10. 이미지 업로드

- **프론트엔드**: `POST /images`
- **백엔드**: ❌ 없음

## 현재 설정 상태

### 백엔드

- **포트**: 3000
- **주소**: `http://localhost:3000`
- **CORS_ORIGIN**: `http://localhost:3001`

### 프론트엔드

- **포트**: 3001
- **주소**: `http://localhost:3001`
- **API URL**: `http://localhost:3000` (`.env.local`에 설정됨)

## 작동 가능한 기능

현재 백엔드에 구현된 API로는 다음 기능만 작동합니다:

1. ✅ 그룹 참가 (프론트엔드에서 호출 가능)
2. ✅ 그룹 탈퇴 (프론트엔드에서 호출 가능)
3. ✅ 랭킹 조회 (프론트엔드에서 호출 가능)

나머지 기능들은 백엔드에 API가 없어서 오류가 발생할 수 있습니다.
