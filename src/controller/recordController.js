import { CustomError } from '../libs/errorHandler';
import { prismaClient } from '../libs/constants';
import { CreateRecordStruct } from '../structs/recordStructs';
import { assert } from 'superstruct';

export class recordController {
    //운동 기록 생성
    async CreateRecords(req, res, next) {
        try {
            const { id } = parseInt(req.params);

            if (isNaN(id)) {
                return res.status(400).json({
                    path: "groupId",
                    message: "groupId must be integer"
                });
            }
            assert(req.body, CreateRecordStruct);
            const {
                exercisetype,
                description,
                time,
                distance,
                photos,
                authorNickname,
                authorPassword
            } = req.body;
            const record = await prismaClient.exerciseRecord.create({
                data: {
                    exerciseType: exercisetype,
                    description: description,
                    time: time,
                    distance: distance,
                    photos: photos,
                    authorNickname: authorNickname,
                    authorPassword: authorPassword
                },
                select:
                {
                    id: true,
                    exercisetype: true,
                    description: true,
                    time: true,
                    distance: true,
                    photos: true,
                    author: {
                        id: true,
                    }
                }
            });
        }
        catch (err) {
            next(err);
        }
    }
    //운동 기록 목록 조회
    async GetRecords(req, res, next) {
        try {
            const { id } = req.params;
            if (isNaN(id)) {
                throw new CustomError("유효하지 않은 그룹 ID입니다.", 400);
            }
            const {
                exercisetype,
                description,
                time,
                distance,
                photos,
                authorNickname,
                authorPassword
            } = req.body;

        }
        catch (err) {
            next(err);
        }
    }
}

