import express from 'express';
import multer from 'multer';
import path from 'path';
import { ImageUploadController } from '../controller/imageUpLoadController.js';
import { catchAsync } from '../libs/catchAsync.js';
import { imageUploadLimit } from '../libs/constants.js';

const UploadRouter = express.Router({ mergeParams: true });
const UploadController = new ImageUploadController();


const storage = multer.diskStorage({
    destination(req, file, done) {
        done(null, 'uploads/'); // uploads 폴더에 저장
    },
    filename(req, file, done) {
        // 파일명 중복 방지: 원본파일명 + 타임스탬프 + 확장자
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        done(null, `${basename}_${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, done) => {
    // mimetype이 image/로 시작하는지 확인 (image/jpeg, image/png 등)
    if (file.mimetype.startsWith('image/')) {
        done(null, true);
    } else {
        // API 명세서에 맞춘 에러 메시지 생성
        const error = new Error("File should be an image file");
        error.status = 400;
        done(error, false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한 (선택 사항)
});

UploadRouter.post('/', upload.array('files', imageUploadLimit), catchAsync(UploadController.UploadImage));


UploadRouter.use((err, req, res, next) => {
    // Multer에서 보낸 400 에러 ("File should be an image file") 처리
    if (err.message === "File should be an image file") {
        return res.status(400).json({ message: err.message });
    }
    // Multer의 파일 크기 제한 에러 등
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "File size is too large" });
    }
    // 기타 에러
    res.status(500).json({ message: err.message });
});


export default UploadRouter;