# 프론트엔드-백엔드 API 매칭 및 작동 현황

최종 업데이트: 2024년 11월

## 📊 전체 현황 요약

- ✅ **작동하는 API**: 3개
- ❌ **백엔드에 없는 API**: 8개
- 📋 **총 API**: 11개

---

## ✅ 작동하는 API (백엔드에 구현됨)

### 1. 그룹 참가

- **프론트엔드**: `POST /groups/${groupId}/participants`
- **백엔드**: `POST /groups/:groupId/participants`
- **상태**: ✅ **정상 작동**
- **요청 본문**: `{ nickname: string, password: string }`
- **응답**: `201 Created` - 그룹 정보 (participants 포함)
- **테스트**: ✅ CORS 정상, 응답 정상

### 2. 그룹 탈퇴

- **프론트엔드**: `DELETE /groups/${groupId}/participants`
- **백엔드**: `DELETE /groups/:groupId/participants`
- **상태**: ✅ **정상 작동**
- **요청 본문**: `{ nickname: string, password: string }`
- **응답**: `204 No Content`
- **테스트**: ✅ CORS 정상, 응답 정상

### 3. 랭킹 조회

- **프론트엔드**: `GET /groups/${groupId}/rank?duration=${duration}`
- **백엔드**: `GET /groups/:groupId/rank?duration=weekly|monthly`
- **상태**: ✅ **정상 작동**
- **쿼리 파라미터**: `duration` (weekly | monthly)
- **응답**: 랭킹 배열
  ```json
  [
    {
      "participantId": number,
      "nickname": string,
      "recordCount": number,
      "recordTime": number
    }
  ]
  ```
- **테스트**: ✅ CORS 정상, 응답 정상

### 4. 기록 상세 조회 (백엔드만 구현)

- **프론트엔드**: 호출 안 함
- **백엔드**: `GET /groups/records/:recordId`
- **상태**: ✅ 구현됨 (프론트엔드에서 미사용)

---

## ❌ 백엔드에 없는 API (404 에러 발생)

### 1. 그룹 목록 조회 ⚠️ **중요**

- **프론트엔드**: `GET /groups?page=1&limit=6&order=desc&orderBy=createdAt&search=`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 홈 페이지에서 그룹 목록 표시
- **영향**: 홈 페이지가 정상 작동하지 않음

### 2. 그룹 상세 조회 ⚠️ **중요**

- **프론트엔드**: `GET /groups/${groupId}`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 그룹 상세 페이지
- **영향**: 그룹 상세 페이지가 정상 작동하지 않음

### 3. 그룹 생성 ⚠️ **중요**

- **프론트엔드**: `POST /groups`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 새 그룹 생성
- **영향**: 그룹 생성 기능 작동 안 함

### 4. 그룹 수정

- **프론트엔드**: `PATCH /groups/${groupId}`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 그룹 편집
- **영향**: 그룹 편집 기능 작동 안 함

### 5. 그룹 삭제

- **프론트엔드**: `DELETE /groups/${groupId}`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 그룹 삭제
- **영향**: 그룹 삭제 기능 작동 안 함

### 6. 그룹 좋아요

- **프론트엔드**: `POST /groups/${groupId}/likes`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 좋아요 버튼
- **영향**: 좋아요 기능 작동 안 함

### 7. 그룹 좋아요 취소

- **프론트엔드**: `DELETE /groups/${groupId}/likes`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 좋아요 취소
- **영향**: 좋아요 취소 기능 작동 안 함

### 8. 기록 목록 조회 ⚠️ **중요**

- **프론트엔드**: `GET /groups/${groupId}/records?page=1&limit=6&order=desc&orderBy=createdAt&search=`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 그룹의 기록 목록 표시
- **영향**: 기록 목록 페이지가 정상 작동하지 않음

### 9. 기록 생성 ⚠️ **중요**

- **프론트엔드**: `POST /groups/${groupId}/records`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 새 기록 생성
- **영향**: 기록 생성 기능 작동 안 함

### 10. 이미지 업로드

- **프론트엔드**: `POST /images`
- **백엔드**: ❌ **없음**
- **상태**: ❌ **404 에러 발생**
- **프론트엔드 사용**: 이미지 업로드
- **영향**: 이미지 업로드 기능 작동 안 함

---

## 🔧 현재 설정 상태

### 백엔드 서버

- **포트**: `3000`
- **주소**: `http://localhost:3000`
- **CORS_ORIGIN**: `http://localhost:3001` (환경 변수)
- **상태**: ✅ 실행 중

### 프론트엔드 서버

- **포트**: `3001`
- **주소**: `http://localhost:3001`
- **API Base URL**: `http://localhost:3000` (`.env.local`)
- **상태**: ✅ 실행 중

### CORS 설정

- ✅ 프론트엔드(3001) → 백엔드(3000) 요청 허용됨
- ✅ Trailing slash 정규화 지원
- ✅ 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE, PATCH, OPTIONS)

---

## 📋 우선순위별 구현 권장사항

### 🔴 높은 우선순위 (필수 기능)

1. **그룹 목록 조회** (`GET /groups`) - 홈 페이지 필수
2. **그룹 상세 조회** (`GET /groups/:groupId`) - 그룹 상세 페이지 필수
3. **기록 목록 조회** (`GET /groups/:groupId/records`) - 기록 목록 페이지 필수

### 🟡 중간 우선순위 (핵심 기능)

4. **그룹 생성** (`POST /groups`) - 그룹 생성 기능
5. **기록 생성** (`POST /groups/:groupId/records`) - 기록 생성 기능

### 🟢 낮은 우선순위 (추가 기능)

6. 그룹 수정 (`PATCH /groups/:groupId`)
7. 그룹 삭제 (`DELETE /groups/:groupId`)
8. 그룹 좋아요 (`POST /groups/:groupId/likes`)
9. 그룹 좋아요 취소 (`DELETE /groups/:groupId/likes`)
10. 이미지 업로드 (`POST /images`)

---

## 🧪 테스트 결과

### ✅ 정상 작동

```bash
# 랭킹 조회 (그룹이 없으면 에러 메시지, API는 정상 작동)
curl http://localhost:3000/groups/1/rank?duration=weekly
# 응답: {"success":false,"message":"그룹을 찾을 수 없습니다."}

# 그룹 참가 (그룹이 없으면 에러 메시지, API는 정상 작동)
curl -X POST http://localhost:3000/groups/1/participants \
  -H "Content-Type: application/json" \
  -d '{"nickname":"test","password":"test"}'
# 응답: {"success":false,"message":"그룹을 찾을 수 없습니다."}
```

### ❌ 404 에러

```bash
# 그룹 목록 조회
curl http://localhost:3000/groups
# 응답: {"success":false,"message":"요청한 리소스를 찾을 수 없습니다."}

# 그룹 상세 조회
curl http://localhost:3000/groups/1
# 응답: {"success":false,"message":"요청한 리소스를 찾을 수 없습니다."}
```

---

## 📝 참고사항

1. 현재 백엔드에는 **그룹 참가/탈퇴**와 **랭킹 조회** API만 구현되어 있습니다.
2. 프론트엔드의 주요 기능(홈, 그룹 상세, 기록 목록)은 대부분 백엔드 API가 없어 작동하지 않습니다.
3. CORS 설정은 정상이며, 프론트엔드에서 백엔드로의 요청은 허용됩니다.
4. 모든 API는 에러 응답 형식을 표준화하여 반환합니다:
   ```json
   {
     "success": false,
     "message": "에러 메시지",
     "path": "필드명 (선택적)"
   }
   ```

---

## 🔄 업데이트 이력

- 2024-11-18: 최초 작성, API 매칭 현황 및 작동 테스트 결과 기록
