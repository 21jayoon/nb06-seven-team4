import { object, string, defaulted, optional, enums, min, number, array, size } from 'superstruct';
import { integerString } from './commonStructs.js';

const ExerciseType = enums(["run", "cycle", "swim"]);

export const CreateRecordStruct = object({
    exerciseType: ExerciseType,
    description: defaulted(string(), ""),
    time: min(number(), 0),
    distance: min(number(), 0),
    photos: optional(size(array(string()), 0, 3)),
    authorNickname: string(),
    authorPassword: string()
});

export const GetRecordStruct = object({
    page: defaulted(integerString, 1),
    limit: defaulted(integerString, 10),
    order: defaulted(enums(['asc', 'desc']), 'desc'),
    orderBy: defaulted(enums(['time', 'createdAt']), 'createdAt'),
    search: optional(string())
});



