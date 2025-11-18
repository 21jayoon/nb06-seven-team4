import { CustomError } from '../libs/errorHandler.js';
import { prismaClient } from '../libs/constants.js';
import { CreateRecordStruct, GetRecordStruct } from '../structs/recordStructs.js';
import { assert, create } from 'superstruct';
import { exerciseType } from '@prisma/client';

export class recordController {

    //운동 기록 생성
    async CreateRecords(req, res, next) {
        try {
            const { groupid } = req.params;
            const id = parseInt(groupid);
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

            const participant = await prismaClient.participant.findFirst({
                where: {
                    groupid: id,
                    nickname: authorNickname
                }
            });
            const group = await prismaClient.group.findFirst({
                where: {
                    id: id
                }
            });
            if (!participant) {
                return res.status(403).json({ message: "존재하지 않는 그룹원이거나 닉네임이 잘못되었습니다." });
            }

            if (participant.password !== authorPassword) {
                return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
            }

            const newRecord = await prismaClient.exerciseRecord.create({
                data: {
                    exerciseType,
                    description,
                    time,
                    distance,
                    photos,
                    authorNickname,
                    authorPassword,
                    groupId: id,
                    participantId: participant.id
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
            const webhookUrl = participant.groupid.discordwebhookurl;
            if (webhookUrl) {
                const recordData = {
                    nickname: authorNickname,
                    exerciseType,
                    time,
                    distance,
                    description,
                    photos
                };
                // 위에서 만든 함수 호출
                sendDiscordNotification(webhookUrl, recordData, participant.group.groupName);
            }
            res.status(201).send(response);
        }
        catch (err) {
            next(err);
        }
    }
    //운동 기록 목록 조회
    async GetRecords(req, res, next) {
        try {
            const { groupid } = req.params;
            const id = parseInt(groupid);
            if (isNaN(id)) {
                return res.status(400).json({
                    path: "groupId",
                    message: "groupId must be integer"
                });
            }

            const { page = 1, limit = 1, order = 'desc', orderBy = 'createdAt', search } =
                create(req.query, GetRecordStruct);
            const where = {//닉네임으로 검색
                nickname: search ? { contains: search } : undefined,
            };
            const group = await prismaClient.group.findUnique({ where: { id } });
            if (!group) throw new CustomError("해당 그룹을 찾을 수 없습니다.", 404);

            let orderBySetting;//정렬 셋팅을 위한 변수
            switch (orderBy) {
                case 'time': { orderBySetting = { time: order }; } break;
                case 'createdAt': { orderBySetting = { createdAt: order }; } break;
                default: { orderBySetting = { createdAt: order }; } break;
            }
            const [totalCount, records] = await Promise.all([
                // 총 개수 (페이지네이션 계산용)
                prismaClient.exerciseRecord.count({ where }),
                prismaClient.exerciseRecord.findMany({
                    where,
                    take: limit,
                    skip: (page - 1) * limit,
                    orderBy: orderBySetting,
                })
            ]);

            const formattedRecords = records.map(record => ({
                id: record.id,
                exerciseType: record.exerciseType,
                description: record.description || {},
                time: record.time,
                distance: record.distance,
                photos: record.photos,
                author: {
                    id: record.participantId,
                    nickname: record.authorNickname
                }
            }));
            return res.status(200).json({
                data: formattedRecords,
                total: totalCount
            });
        }
        catch (err) {
            next(err);
        }
    }
}

