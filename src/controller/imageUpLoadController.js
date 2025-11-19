export class ImageUploadController {
  async UploadImage(req, res, next) {
    try {
      // Multer가 파일을 처리하지 못했거나(필터링 등), 파일이 없는 경우
      if (!req.files || req.files.length === 0) {
        // 필터링 에러가 아니라 그냥 파일을 안 보낸 경우 처리
        return res.status(400).json({ message: 'No files uploaded' });
      }
      // req.files에 저장된 파일 정보들을 순회하며 URL 문자열 생성
      // 예: http://localhost:3000/uploads/myimage_12345.jpg
      const urls = req.files.map((file) => {
        // req.protocol: http 또는 https
        // req.get('host'): localhost:3000
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      });

      // API 명세서에 맞춘 응답 (200 OK)
      res.status(200).json({
        urls: urls,
      });
    } catch (err) {
      next(err);
    }
  }
}
