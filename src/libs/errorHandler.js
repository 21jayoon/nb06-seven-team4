import multer from 'multer';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma 초기화 에러 처리
  if (err.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      success: false,
      message: '데이터베이스 연결에 실패했습니다. DATABASE_URL을 확인해주세요.',
    });
  }

  // Prisma 에러 처리
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: '중복된 데이터가 존재합니다.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: '요청한 데이터를 찾을 수 없습니다.',
    });
  }

  // Multer 에러 처리
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 너무 큽니다.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '파일 개수가 너무 많습니다.',
      });
    }
  }

  // 기본 에러 처리
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
