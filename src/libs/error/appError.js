// 커스텀 에러 클래스
class AppError extends Error {
  constructor(message, statusCode = 500, path = null) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.isOperational = true; // 예상 가능한 에러인지 구분

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
