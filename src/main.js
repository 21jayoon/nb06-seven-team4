import 'dotenv/config';
import { PORT } from './libs/constants.js';
import express from 'express';
import cors from 'cors';
import groupRouter from './router/groupRouter.js';
import participantRouter from './router/participantRouter.js';
import rankingRouter from './router/rankingRouter.js';
import errorHandler from './libs/error/errorHandler.js';

const app = express();
const port = PORT || 3000;

// 미들웨어
// CORS 설정: 개발 환경에서는 모든 origin 허용, 프로덕션에서는 환경 변수로 제어
const getCorsOrigin = () => {
  const corsOrigin = process.env.CORS_ORIGIN;

  // CORS_ORIGIN이 설정되지 않았거나 '*'이면 모든 origin 허용
  if (!corsOrigin || corsOrigin === '*') {
    return '*';
  }

  // 쉼표로 구분된 여러 origin 허용 (예: "https://domain1.com,https://domain2.com")
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((origin) => origin.trim().replace(/\/$/, ''));
  }

  // 단일 origin (trailing slash 제거)
  return corsOrigin.trim().replace(/\/$/, '');
};

// CORS origin 검증 함수 (trailing slash 정규화)
const corsOriginChecker = (origin, callback) => {
  const allowedOrigins = getCorsOrigin();

  // 모든 origin 허용
  if (allowedOrigins === '*') {
    return callback(null, true);
  }

  // 배열로 변환 (단일 origin인 경우)
  const origins = Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins];

  // origin이 없으면 허용하지 않음 (같은 origin 요청)
  if (!origin) {
    return callback(null, false);
  }

  // trailing slash 제거 후 비교
  const normalizedOrigin = origin.replace(/\/$/, '');
  const isAllowed = origins.some((allowed) => {
    const normalizedAllowed = allowed.replace(/\/$/, '');
    return normalizedOrigin === normalizedAllowed;
  });

  callback(null, isAllowed);
};

app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터
app.use('/', participantRouter);
app.use('/', rankingRouter);
app.use('/', groupRouter);
app.use('/', recordRouter);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.',
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
