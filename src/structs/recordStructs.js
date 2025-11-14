import { exerciseType } from '@prisma/client';
import { object, string, defaulted, optional, enums, min, number, array, } from 'superstruct';


const ExerciseType = enums(["run", "cycle", "swim"]);

export const CreateRecordStruct = object({
    exerciseType: ExerciseType,
    description: defaulted(string(), ""),
    time: min(number(), 0),
    distance: min(number(), 0),
    photos: optional(array(string())),
    authorNickname: string(),
    authorPassword: string()
});



