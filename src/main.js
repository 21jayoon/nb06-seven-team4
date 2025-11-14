import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import participantRouter from './router/participantRouter.js';
import rankingRouter from './router/rankingRouter.js';
import errorHandler from './libs/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
// CORS 설정: 개발 환경에서는 모든 origin 허용, 프로덕션에서는 환경 변수로 제어
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터
app.use('/groups', participantRouter);
app.use('/groups', rankingRouter);

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
