import { CustomError } from '../libs/errorHandler.js';
import { prismaClient } from '../libs/constants.js';
import { CreateRecordStruct } from '../structs/recordStructs.js';
import { assert } from 'superstruct';

export class recordController {
    //운동 기록 생성
    async CreateRecords(req, res, next) {
        try {
            const { groupId } = req.params;
            const id = parseInt(groupId);

            if (isNaN(id)) {
                return res.status(400).json({
                    path: "groupId",
                    message: "groupId must be integer"
                });
            }
            assert(req.body, CreateRecordStruct);
            const {
                exerciseType,
                description,
                time,
                distance,
                photos,
                authorNickname,
                authorPassword
            } = req.body;

            // -------------------------------------------------------
            // [핵심 로직] 그룹 내 참여자 확인 및 비밀번호 체크
            // -------------------------------------------------------

            // 단계 1: 해당 그룹(id)에 해당 닉네임(authorNickname)을 가진 참가자가 있는지 찾기
            const participant = await prismaClient.participant.findFirst({
                where: {
                    groupid: id,              // URL로 들어온 그룹 ID
                    nickname: authorNickname, // Body로 들어온 닉네임
                }
            });

            // 단계 2: 참가자가 존재하지 않거나, 비밀번호가 틀린 경우 차단
            if (!participant) {
                return res.status(403).json({ message: "존재하지 않는 그룹원이거나 닉네임이 잘못되었습니다." });
            }

            if (participant.password !== authorPassword) {
                return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
            }
            // -------------------------------------------------------

            const newRecord = await prismaClient.exerciseRecord.create({
                data: {
                    exerciseType,
                    description,
                    time,
                    distance,
                    photos,
                    authorNickname,
                    authorPassword,
                    groupId: id
                }
            });
            const response = {
                id: newRecord.id,
                exerciseType: newRecord.exerciseType,
                description: newRecord.description,
                time: newRecord.time,
                distance: newRecord.distance,
                photos: newRecord.photos,
                author: {
                    id: participant.id,
                    nickname: newRecord.authorNickname
                }
            };
            res.status(201).send(response);
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

